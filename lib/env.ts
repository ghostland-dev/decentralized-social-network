/**
 * Environment configuration and validation
 * Centralized place for all environment variables
 */

import type { NostrRelay } from "@/lib/nostr/types"

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value || ""
}

function parseRelays(relaysString?: string): NostrRelay[] {
  if (!relaysString) {
    return [
      { url: "wss://relay.damus.io", read: true, write: true },
      { url: "wss://relay.nostr.band", read: true, write: true },
      { url: "wss://nos.lol", read: true, write: true },
      { url: "wss://relay.snort.social", read: true, write: true },
    ]
  }

  return relaysString.split(",").map((url) => ({
    url: url.trim(),
    read: true,
    write: true,
  }))
}

export const env = {
  // Application
  appName: getEnvVar("NEXT_PUBLIC_APP_NAME", "Nostr Social Network"),
  appUrl: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  
  // Nostr Configuration
  defaultRelays: parseRelays(process.env.NEXT_PUBLIC_DEFAULT_RELAYS),
  
  // Feature Flags
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const

// Validate critical environment variables on startup (only in production)
if (env.isProduction) {
  const requiredVars: string[] = []
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable in production: ${varName}`)
    }
  }
}
