import { MemoryCache } from '../cache'

describe('MemoryCache', () => {
  let cache: MemoryCache<any>

  beforeEach(() => {
    cache = new MemoryCache(3, 1000) // max 3 items, 1 second TTL
  })

  afterEach(() => {
    cache.clear()
  })

  describe('basic operations', () => {
    it('should set and get values', () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
    })

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull()
    })

    it('should check if key exists', () => {
      cache.set('key1', 'value1')
      expect(cache.has('key1')).toBe(true)
      expect(cache.has('key2')).toBe(false)
    })

    it('should delete keys', () => {
      cache.set('key1', 'value1')
      cache.delete('key1')
      expect(cache.get('key1')).toBeNull()
    })

    it('should clear all entries', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.clear()
      expect(cache.size()).toBe(0)
    })
  })

  describe('size management', () => {
    it('should respect max size', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      cache.set('key4', 'value4') // Should evict oldest (key1)

      expect(cache.size()).toBe(3)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key4')).toBe('value4')
    })
  })

  describe('TTL management', () => {
    it('should expire entries after TTL', async () => {
      cache.set('key1', 'value1', 100) // 100ms TTL
      expect(cache.get('key1')).toBe('value1')

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(cache.get('key1')).toBeNull()
    })

    it('should use default TTL if not specified', async () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')

      await new Promise(resolve => setTimeout(resolve, 1100))
      expect(cache.get('key1')).toBeNull()
    })
  })

  describe('cleanup', () => {
    it('should clean up expired entries', async () => {
      cache.set('key1', 'value1', 100)
      cache.set('key2', 'value2', 2000)
      
      expect(cache.size()).toBe(2)

      await new Promise(resolve => setTimeout(resolve, 150))
      cache.cleanup()

      expect(cache.size()).toBe(1)
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBe('value2')
    })
  })

  describe('complex data types', () => {
    it('should handle objects', () => {
      const obj = { name: 'test', value: 123 }
      cache.set('obj', obj)
      expect(cache.get('obj')).toEqual(obj)
    })

    it('should handle arrays', () => {
      const arr = [1, 2, 3, 'test']
      cache.set('arr', arr)
      expect(cache.get('arr')).toEqual(arr)
    })

    it('should handle null values', () => {
      cache.set('null', null)
      expect(cache.get('null')).toBe(null)
    })
  })
})