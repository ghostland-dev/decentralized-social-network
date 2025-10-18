// Application configuration with environment variables
export const config = {
  // Application
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // Nostr Relays
  defaultRelays: (process.env.NEXT_PUBLIC_NOSTR_RELAYS || 'wss://relay.damus.io,wss://relay.nostr.band,wss://nos.lol,wss://relay.snort.social')
    .split(',')
    .map(url => ({ url: url.trim(), read: true, write: true })),

  // Feature Flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    debugLogs: process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === 'true',
    webln: process.env.NEXT_PUBLIC_ENABLE_WEBLN === 'true',
  },

  // Cache Configuration (in milliseconds)
  cache: {
    profileTTL: parseInt(process.env.NEXT_PUBLIC_PROFILE_CACHE_TTL || '600000', 10), // 10 minutes
    eventTTL: parseInt(process.env.NEXT_PUBLIC_EVENT_CACHE_TTL || '300000', 10), // 5 minutes
  },

  // Pagination
  pagination: {
    postsPerPage: parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE || '20', 10),
    messagesPerPage: parseInt(process.env.NEXT_PUBLIC_MESSAGES_PER_PAGE || '50', 10),
  },

  // Rate Limiting
  rateLimits: {
    maxPostsPerMinute: parseInt(process.env.NEXT_PUBLIC_MAX_POSTS_PER_MINUTE || '10', 10),
    maxMessagesPerMinute: parseInt(process.env.NEXT_PUBLIC_MAX_MESSAGES_PER_MINUTE || '30', 10),
  },

  // External Services
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },
}

// Type-safe config getter
export function getConfig<K extends keyof typeof config>(key: K): typeof config[K] {
  return config[key]
}