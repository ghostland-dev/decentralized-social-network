"use client"

import { SimplePool } from "nostr-tools/pool"
import type { Event } from "nostr-tools"
import { finalizeEvent } from "nostr-tools/pure"
import * as nip04 from "nostr-tools/nip04"
import { hexToBytes } from "./encoding"
import type { NostrRelay, NostrProfile } from "./types"

class NostrClient {
  private pool: SimplePool
  private relays: string[]

  constructor(relays: NostrRelay[]) {
    this.pool = new SimplePool()
    this.relays = relays.map((r) => r.url)
  }

  async publishEvent(event: Partial<Event>, privateKey: string): Promise<Event> {
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

    await Promise.any(this.pool.publish(this.relays, signedEvent))

    return signedEvent
  }

  async subscribeToEvents(filters: any[], onEvent: (event: Event) => void, onEose?: () => void) {
    const sub = this.pool.subscribeMany(this.relays, filters as any, {
      onevent: onEvent,
      oneose: onEose,
    })

    return sub
  }

  async getProfile(pubkey: string): Promise<NostrProfile | null> {
    const events = await this.pool.querySync(this.relays, {
      kinds: [0],
      authors: [pubkey],
      limit: 1,
    })

    if (events.length === 0) return null

    try {
      return JSON.parse(events[0].content)
    } catch {
      return null
    }
  }

  async updateProfile(profile: NostrProfile, privateKey: string): Promise<void> {
    await this.publishEvent(
      {
        kind: 0,
        content: JSON.stringify(profile),
      },
      privateKey,
    )
  }

  async encryptMessage(content: string, recipientPubkey: string, senderPrivkey: string): Promise<string> {
    return await nip04.encrypt(hexToBytes(senderPrivkey), recipientPubkey, content)
  }

  async decryptMessage(content: string, senderPubkey: string, recipientPrivkey: string): Promise<string> {
    return await nip04.decrypt(hexToBytes(recipientPrivkey), senderPubkey, content)
  }

  close() {
    this.pool.close(this.relays)
  }
}

export default NostrClient
