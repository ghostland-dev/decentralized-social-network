import {
  validatePrivateKey,
  validatePublicKey,
  validateProfile,
  validatePost,
  validateRelayUrl,
  validateZapAmount,
  sanitizeHtml,
  sanitizeUrl,
} from '../validation'
import { ValidationError } from '../errors'

describe('Validation Functions', () => {
  describe('validatePrivateKey', () => {
    it('should validate a correct private key', () => {
      const validKey = 'a'.repeat(64)
      expect(validatePrivateKey(validKey)).toBe(validKey)
    })

    it('should throw for invalid length', () => {
      expect(() => validatePrivateKey('abc')).toThrow(ValidationError)
    })

    it('should throw for non-hex characters', () => {
      const invalidKey = 'z'.repeat(64)
      expect(() => validatePrivateKey(invalidKey)).toThrow(ValidationError)
    })
  })

  describe('validatePublicKey', () => {
    it('should validate a correct public key', () => {
      const validKey = 'f'.repeat(64)
      expect(validatePublicKey(validKey)).toBe(validKey)
    })

    it('should throw for invalid format', () => {
      expect(() => validatePublicKey('invalid')).toThrow(ValidationError)
    })
  })

  describe('validateProfile', () => {
    it('should validate a complete profile', () => {
      const profile = {
        name: 'Test User',
        display_name: 'Test',
        about: 'Test bio',
        picture: 'https://example.com/pic.jpg',
        website: 'https://example.com',
      }
      expect(validateProfile(profile)).toEqual(profile)
    })

    it('should validate a partial profile', () => {
      const profile = { name: 'Test' }
      expect(validateProfile(profile)).toEqual(profile)
    })

    it('should throw for invalid URL', () => {
      const profile = { website: 'not-a-url' }
      expect(() => validateProfile(profile)).toThrow(ValidationError)
    })

    it('should throw for too long name', () => {
      const profile = { name: 'a'.repeat(51) }
      expect(() => validateProfile(profile)).toThrow(ValidationError)
    })
  })

  describe('validatePost', () => {
    it('should validate a valid post', () => {
      const post = { content: 'Hello world!' }
      expect(validatePost(post)).toEqual(post)
    })

    it('should throw for empty content', () => {
      expect(() => validatePost({ content: '' })).toThrow(ValidationError)
    })

    it('should throw for too long content', () => {
      const post = { content: 'a'.repeat(5001) }
      expect(() => validatePost(post)).toThrow(ValidationError)
    })
  })

  describe('validateRelayUrl', () => {
    it('should validate a correct relay URL', () => {
      const url = 'wss://relay.example.com'
      expect(validateRelayUrl(url)).toBe(url)
    })

    it('should throw for non-wss URL', () => {
      expect(() => validateRelayUrl('https://example.com')).toThrow(ValidationError)
    })

    it('should throw for invalid URL', () => {
      expect(() => validateRelayUrl('not-a-url')).toThrow(ValidationError)
    })
  })

  describe('validateZapAmount', () => {
    it('should validate valid amounts', () => {
      expect(validateZapAmount(100)).toBe(100)
      expect(validateZapAmount(1000)).toBe(1000)
    })

    it('should throw for zero amount', () => {
      expect(() => validateZapAmount(0)).toThrow(ValidationError)
    })

    it('should throw for negative amount', () => {
      expect(() => validateZapAmount(-100)).toThrow(ValidationError)
    })

    it('should throw for too large amount', () => {
      expect(() => validateZapAmount(1000001)).toThrow(ValidationError)
    })

    it('should throw for decimal amount', () => {
      expect(() => validateZapAmount(100.5)).toThrow(ValidationError)
    })
  })

  describe('sanitizeHtml', () => {
    it('should escape HTML tags', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
        '&amp;lt;script&amp;gt;alert(&amp;quot;xss&amp;quot;)&amp;lt;/script&amp;gt;'
      )
    })

    it('should escape quotes', () => {
      expect(sanitizeHtml('"test" \'test\'')).toBe('&amp;quot;test&amp;quot; &amp;#39;test&amp;#39;')
    })
  })

  describe('sanitizeUrl', () => {
    it('should allow valid URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
      expect(sanitizeUrl('wss://relay.example.com')).toBe('wss://relay.example.com/')
    })

    it('should reject javascript URLs', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('')
    })

    it('should reject invalid URLs', () => {
      expect(sanitizeUrl('not a url')).toBe('')
    })
  })
})