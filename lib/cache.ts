import { logger } from './logger'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class MemoryCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map()
  private maxSize: number
  private defaultTTL: number

  constructor(maxSize: number = 1000, defaultTTL: number = 300000) { // 5 minutes default
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }

  set(key: string, data: T, ttl?: number): void {
    try {
      // Evict oldest entries if cache is full
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.getOldestKey()
        if (oldestKey) {
          this.cache.delete(oldestKey)
        }
      }

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL
      })

      logger.debug('Cache set', { key, size: this.cache.size })
    } catch (error) {
      logger.error('Failed to set cache', error, { key })
    }
  }

  get(key: string): T | null {
    try {
      const entry = this.cache.get(key)
      
      if (!entry) {
        return null
      }

      // Check if entry has expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        logger.debug('Cache entry expired', { key })
        return null
      }

      logger.debug('Cache hit', { key })
      return entry.data
    } catch (error) {
      logger.error('Failed to get from cache', error, { key })
      return null
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    // Check expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    logger.debug('Cache cleared')
  }

  size(): number {
    return this.cache.size
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    return oldestKey
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    let deletedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        deletedCount++
      }
    }

    if (deletedCount > 0) {
      logger.debug('Cache cleanup completed', { deletedCount })
    }
  }

  // Start periodic cleanup
  startCleanupInterval(interval: number = 60000): () => void { // 1 minute default
    const intervalId = setInterval(() => {
      this.cleanup()
    }, interval)

    return () => clearInterval(intervalId)
  }
}

// Singleton instances for different cache types
export const profileCache = new MemoryCache<any>(500, 600000) // 10 minutes TTL
export const eventCache = new MemoryCache<any>(2000, 300000) // 5 minutes TTL

// Start cleanup intervals
const cleanupIntervals: (() => void)[] = []

if (typeof window !== 'undefined') {
  cleanupIntervals.push(profileCache.startCleanupInterval())
  cleanupIntervals.push(eventCache.startCleanupInterval())

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    cleanupIntervals.forEach(cleanup => cleanup())
  })
}