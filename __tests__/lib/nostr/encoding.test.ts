import { hexToBytes, bytesToHex } from '@/lib/nostr/encoding'

describe('Encoding utilities', () => {
  describe('hexToBytes', () => {
    it('should convert hex string to Uint8Array', () => {
      const hex = '48656c6c6f'
      const result = hexToBytes(hex)
      const expected = new Uint8Array([72, 101, 108, 108, 111])
      
      expect(result).toEqual(expected)
    })

    it('should handle empty hex string', () => {
      const result = hexToBytes('')
      expect(result).toEqual(new Uint8Array(0))
    })

    it('should throw error for invalid hex length', () => {
      expect(() => hexToBytes('123')).toThrow('Invalid hex string length')
    })
  })

  describe('bytesToHex', () => {
    it('should convert Uint8Array to hex string', () => {
      const bytes = new Uint8Array([72, 101, 108, 108, 111])
      const result = bytesToHex(bytes)
      expect(result).toBe('48656c6c6f')
    })

    it('should handle empty array', () => {
      const result = bytesToHex(new Uint8Array(0))
      expect(result).toBe('')
    })

    it('should pad single digit hex values', () => {
      const bytes = new Uint8Array([0, 15, 255])
      const result = bytesToHex(bytes)
      expect(result).toBe('000fff')
    })
  })

  describe('round trip conversion', () => {
    it('should maintain data integrity through hex <-> bytes conversion', () => {
      const originalHex = 'deadbeef1234567890abcdef'
      const bytes = hexToBytes(originalHex)
      const convertedBack = bytesToHex(bytes)
      expect(convertedBack).toBe(originalHex)
    })
  })
})