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

  useEffect(() => {
    const keys = loadKeysFromLocalStorage()
    if (keys) {
      initializeUser(keys.privateKey, keys.publicKey)
    }
  }, [])

  const initializeUser = useCallback(async (privateKey: string, publicKey: string) => {
    const newClient = new NostrClient(DEFAULT_RELAYS)
    setClient(newClient)

    const profile = await newClient.getProfile(publicKey)

    setUser({
      pubkey: publicKey,
      privkey: privateKey,
      profile: profile || undefined,
      relays: DEFAULT_RELAYS,
    })
  }, [])

  const login = useCallback(
    async (privateKey: string) => {
      const publicKey = getPublicKeyFromPrivate(privateKey)
      saveKeysToLocalStorage(privateKey, publicKey)
      await initializeUser(privateKey, publicKey)
    },
    [initializeUser],
  )

  const logout = useCallback(() => {
    clearKeysFromLocalStorage()
    if (client) {
      client.close()
    }
    setUser(null)
    setClient(null)
  }, [client])

  const updateProfile = useCallback(
    async (profile: NostrProfile) => {
      if (!user || !user.privkey || !client) return

      await client.updateProfile(profile, user.privkey)
      setUser((prev) => (prev ? { ...prev, profile } : null))
    },
    [user, client],
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
      {children}
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
