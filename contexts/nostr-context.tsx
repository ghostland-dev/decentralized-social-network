"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import NostrClient from "@/lib/nostr/client"
import { DEFAULT_RELAYS, type NostrUser, type NostrProfile, type NostrRelay } from "@/lib/nostr/types"
import {
  loadKeysFromLocalStorage,
  saveKeysToLocalStorage,
  clearKeysFromLocalStorage,
  getPublicKeyFromPrivate,
} from "@/lib/nostr/keys"
import { logger } from "@/lib/logger"
import { validatePrivateKey, validateProfile } from "@/lib/validation"
import { AuthenticationError } from "@/lib/errors"
import { useToast } from "@/hooks/use-toast"

interface NostrContextType {
  user: NostrUser | null
  client: NostrClient | null
  isAuthenticated: boolean
  login: (privateKey: string) => Promise<void>
  logout: () => void
  updateProfile: (profile: NostrProfile) => Promise<void>
  updateRelays: (relays: NostrRelay[]) => void
}

const NostrContext = createContext<NostrContextType | undefined>(undefined)

export function NostrProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NostrUser | null>(null)
  const [client, setClient] = useState<NostrClient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const initializeFromStorage = async () => {
      try {
        const keys = loadKeysFromLocalStorage()
        if (keys) {
          await initializeUser(keys.privateKey, keys.publicKey)
        }
      } catch (error) {
        logger.error('Failed to initialize from storage', error)
        toast({
          title: 'Error',
          description: 'Failed to restore your session. Please login again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeFromStorage()
  }, [toast])

  const initializeUser = useCallback(async (privateKey: string, publicKey: string) => {
    try {
      logger.info('Initializing user', { publicKey })
      
      const newClient = new NostrClient(DEFAULT_RELAYS)
      setClient(newClient)

      const profile = await newClient.getProfile(publicKey)

      setUser({
        pubkey: publicKey,
        privkey: privateKey,
        profile: profile || undefined,
        relays: DEFAULT_RELAYS,
      })
      
      logger.info('User initialized successfully', { publicKey })
    } catch (error) {
      logger.error('Failed to initialize user', error)
      throw error
    }
  }, [])

  const login = useCallback(
    async (privateKey: string) => {
      try {
        // Validate private key
        const validatedKey = validatePrivateKey(privateKey)
        
        const publicKey = getPublicKeyFromPrivate(validatedKey)
        saveKeysToLocalStorage(validatedKey, publicKey)
        await initializeUser(validatedKey, publicKey)
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        })
      } catch (error) {
        logger.error('Login failed', error)
        clearKeysFromLocalStorage()
        
        toast({
          title: 'Login Failed',
          description: error instanceof Error ? error.message : 'Invalid private key',
          variant: 'destructive',
        })
        
        throw new AuthenticationError('Login failed')
      }
    },
    [initializeUser, toast],
  )

  const logout = useCallback(() => {
    logger.info('Logging out user')
    clearKeysFromLocalStorage()
    if (client) {
      client.close()
    }
    setUser(null)
    setClient(null)
    
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    })
  }, [client, toast])

  const updateProfile = useCallback(
    async (profile: NostrProfile) => {
      if (!user || !user.privkey || !client) {
        throw new AuthenticationError('Must be logged in to update profile')
      }

      try {
        // Validate profile data
        const validatedProfile = validateProfile(profile)
        
        await client.updateProfile(validatedProfile, user.privkey)
        setUser((prev) => (prev ? { ...prev, profile: validatedProfile } : null))
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully',
        })
      } catch (error) {
        logger.error('Failed to update profile', error)
        toast({
          title: 'Update Failed',
          description: error instanceof Error ? error.message : 'Failed to update profile',
          variant: 'destructive',
        })
        throw error
      }
    },
    [user, client, toast],
  )

  const updateRelays = useCallback(
    (relays: NostrRelay[]) => {
      setUser((prev) => (prev ? { ...prev, relays } : null))
      if (client) {
        client.close()
        const newClient = new NostrClient(relays)
        setClient(newClient)
      }
    },
    [client],
  )

  return (
    <NostrContext.Provider
      value={{
        user,
        client,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        updateRelays,
      }}
    >
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </NostrContext.Provider>
  )
}

export function useNostr() {
  const context = useContext(NostrContext)
  if (context === undefined) {
    throw new Error("useNostr must be used within a NostrProvider")
  }
  return context
}
