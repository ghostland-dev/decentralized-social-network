"use client"

import { SimplePool, type Event } from "nostr-tools/pool"
import { finalizeEvent } from "nostr-tools/pure"
import * as nip04 from "nostr-tools/nip04"
import { hexToBytes } from "@/lib/hex"
import type { NostrRelay, NostrProfile } from "./types"
import { logger } from "@/lib/logger"
import { NostrError, NetworkError } from "@/lib/errors"
import { profileCache } from "@/lib/cache"

class NostrClient {
  private pool: SimplePool
  private relays: string[]
  private reconnectInterval: NodeJS.Timeout | null = null
  private isConnected: boolean = false

  // Expose for pagination queries
  get relayUrls(): string[] {
    return [...this.relays]
  }

  constructor(relays: NostrRelay[]) {
    this.pool = new SimplePool()
    this.relays = relays.map((r) => r.url)
    this.setupConnectionMonitoring()
  }

  private setupConnectionMonitoring() {
    // Monitor connection status
    this.reconnectInterval = setInterval(() => {
      this.checkConnectionStatus()
    }, 30000) // Check every 30 seconds
  }

  private async checkConnectionStatus() {
    try {
      // Try to connect to at least one relay
      const results = await Promise.allSettled(
        this.relays.map(relay => 
          this.pool.ensureRelay(relay)
        )
      )
      
      const connectedCount = results.filter(r => r.status === 'fulfilled').length
      this.isConnected = connectedCount > 0
      
      if (connectedCount === 0) {
        logger.warn('No relays connected', { relays: this.relays })
      } else {
        logger.debug(`Connected to ${connectedCount}/${this.relays.length} relays`)
      }
    } catch (error) {
      logger.error('Failed to check connection status', error)
      this.isConnected = false
    }
  }

  async publishEvent(event: Partial<Event>, privateKey: string): Promise<Event> {
    try {
      if (!this.isConnected) {
        throw new NetworkError('Not connected to any relays')
      }

      const eventTemplate = {
        kind: event.kind || 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: event.tags || [],
        content: event.content || "",
      }

      // Convert hex private key to Uint8Array
      const privkeyBytes = hexToBytes(privateKey)

      // finalizeEvent handles id generation and signing automatically
      const signedEvent = finalizeEvent(eventTemplate, privkeyBytes)

      logger.debug('Publishing event', { kind: signedEvent.kind, id: signedEvent.id })

      const results = await Promise.allSettled(
        this.pool.publish(this.relays, signedEvent)
      )

      const successCount = results.filter(r => r.status === 'fulfilled').length
      
      if (successCount === 0) {
        throw new NostrError('Failed to publish to any relay', 'PUBLISH_FAILED')
      }

      logger.info(`Event published to ${successCount}/${this.relays.length} relays`, {
        eventId: signedEvent.id
      })

      return signedEvent
    } catch (error) {
      logger.error('Failed to publish event', error)
      throw error
    }
  }

  async subscribeToEvents(filters: any[], onEvent: (event: Event) => void, onEose?: () => void) {
    const sub = this.pool.subscribeMany(this.relays, filters, {
      onevent: onEvent,
      oneose: onEose,
    })

    return sub
  }

  async queryEvents(filters: any[]): Promise<Event[]> {
    try {
      logger.debug('Querying events', { filters })
      const events = await this.pool.querySync(this.relays, filters)
      logger.debug(`Found ${events.length} events`)
      return events
    } catch (error) {
      logger.error('Failed to query events', error)
      throw new NostrError('Failed to query events', 'QUERY_FAILED')
    }
  }

  async getProfile(pubkey: string): Promise<NostrProfile | null> {
    try {
      // Check cache first
      const cached = profileCache.get(pubkey)
      if (cached !== null) {
        logger.debug('Profile found in cache', { pubkey })
        return cached
      }

      logger.debug('Fetching profile from relays', { pubkey })
      
      const events = await this.pool.querySync(this.relays, {
        kinds: [0],
        authors: [pubkey],
        limit: 1,
      })

      if (events.length === 0) {
        logger.debug('No profile found', { pubkey })
        // Cache null result to avoid repeated queries
        profileCache.set(pubkey, null, 60000) // 1 minute for null results
        return null
      }

      try {
        const profile = JSON.parse(events[0].content)
        logger.debug('Profile fetched successfully', { pubkey })
        
        // Cache the profile
        profileCache.set(pubkey, profile)
        
        return profile
      } catch (parseError) {
        logger.warn('Failed to parse profile content', parseError, { pubkey })
        return null
      }
    } catch (error) {
      logger.error('Failed to fetch profile', error, { pubkey })
      throw new NostrError('Failed to fetch profile', 'PROFILE_FETCH_FAILED', { pubkey })
    }
  }

  async updateProfile(profile: NostrProfile, privateKey: string): Promise<void> {
    const event = await this.publishEvent(
      {
        kind: 0,
        content: JSON.stringify(profile),
      },
      privateKey,
    )
    
    // Update cache with new profile
    profileCache.set(event.pubkey, profile)
  }

  async encryptMessage(content: string, recipientPubkey: string, senderPrivkey: string): Promise<string> {
    return await nip04.encrypt(hexToBytes(senderPrivkey), recipientPubkey, content)
  }

  async decryptMessage(content: string, senderPubkey: string, recipientPrivkey: string): Promise<string> {
    return await nip04.decrypt(hexToBytes(recipientPrivkey), senderPubkey, content)
  }

  close() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval)
      this.reconnectInterval = null
    }
    this.pool.close(this.relays)
    logger.info('NostrClient closed')
  }
}

export default NostrClient
