import { generateKeyPair, getPublicKeyFromPrivate, saveKeysToLocalStorage, loadKeysFromLocalStorage, clearKeysFromLocalStorage } from '@/lib/nostr/keys'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Key management utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateKeyPair', () => {
    it('should generate a valid key pair', () => {
      const keyPair = generateKeyPair()
      
      expect(keyPair).toHaveProperty('privateKey')
      expect(keyPair).toHaveProperty('publicKey')
      expect(keyPair).toHaveProperty('nsec')
      expect(keyPair).toHaveProperty('npub')
      
      expect(typeof keyPair.privateKey).toBe('string')
      expect(typeof keyPair.publicKey).toBe('string')
      expect(typeof keyPair.nsec).toBe('string')
      expect(typeof keyPair.npub).toBe('string')
    })

    it('should generate different key pairs each time', () => {
      const keyPair1 = generateKeyPair()
      const keyPair2 = generateKeyPair()
      
      expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey)
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey)
    })
  })

  describe('getPublicKeyFromPrivate', () => {
    it('should derive public key from private key', () => {
      const keyPair = generateKeyPair()
      const derivedPublicKey = getPublicKeyFromPrivate(keyPair.privateKey)
      
      expect(derivedPublicKey).toBe(keyPair.publicKey)
    })
  })

  describe('localStorage operations', () => {
    describe('saveKeysToLocalStorage', () => {
      it('should save keys to localStorage', () => {
        const privateKey = 'test-private-key'
        const publicKey = 'test-public-key'
        
        saveKeysToLocalStorage(privateKey, publicKey)
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith('nostr_privkey', privateKey)
        expect(localStorageMock.setItem).toHaveBeenCalledWith('nostr_pubkey', publicKey)
      })
    })

    describe('loadKeysFromLocalStorage', () => {
      it('should load keys from localStorage', () => {
        const privateKey = 'test-private-key'
        const publicKey = 'test-public-key'
        
        localStorageMock.getItem.mockImplementation((key) => {
          if (key === 'nostr_privkey') return privateKey
          if (key === 'nostr_pubkey') return publicKey
          return null
        })
        
        const result = loadKeysFromLocalStorage()
        
        expect(result).toEqual({ privateKey, publicKey })
      })

      it('should return null if keys are not found', () => {
        localStorageMock.getItem.mockReturnValue(null)
        
        const result = loadKeysFromLocalStorage()
        
        expect(result).toBeNull()
      })

      it('should return null if only one key is found', () => {
        localStorageMock.getItem.mockImplementation((key) => {
          if (key === 'nostr_privkey') return 'test-private-key'
          return null
        })
        
        const result = loadKeysFromLocalStorage()
        
        expect(result).toBeNull()
      })
    })

    describe('clearKeysFromLocalStorage', () => {
      it('should clear keys from localStorage', () => {
        clearKeysFromLocalStorage()
        
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('nostr_privkey')
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('nostr_pubkey')
      })
    })
  })
})