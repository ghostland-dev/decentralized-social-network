export interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

export interface NostrProfile {
  name?: string
  display_name?: string
  about?: string
  picture?: string
  banner?: string
  nip05?: string
  lud16?: string
  website?: string
}

export interface NostrRelay {
  url: string
  read: boolean
  write: boolean
}

export interface NostrUser {
  pubkey: string
  privkey?: string
  profile?: NostrProfile
  relays: NostrRelay[]
}

// DEFAULT_RELAYS moved to lib/env.ts for better configuration management
// This is kept for backward compatibility but should use env.defaultRelays
export const DEFAULT_RELAYS: NostrRelay[] = [
  { url: "wss://relay.damus.io", read: true, write: true },
  { url: "wss://relay.nostr.band", read: true, write: true },
  { url: "wss://nos.lol", read: true, write: true },
  { url: "wss://relay.snort.social", read: true, write: true },
]

export enum NostrKind {
  Metadata = 0,
  Text = 1,
  RecommendRelay = 2,
  Contacts = 3,
  EncryptedDirectMessage = 4,
  EventDeletion = 5,
  Repost = 6,
  Reaction = 7,
  ChannelCreation = 40,
  ChannelMetadata = 41,
  ChannelMessage = 42,
  ZapRequest = 9734,
  Zap = 9735,
}
