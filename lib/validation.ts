import { z } from 'zod'
import { ValidationError } from './errors'

// Nostr specific validations
export const nostrPrivateKeySchema = z.string()
  .length(64, 'Private key must be 64 characters')
  .regex(/^[0-9a-fA-F]+$/, 'Private key must be hexadecimal')

export const nostrPublicKeySchema = z.string()
  .length(64, 'Public key must be 64 characters')
  .regex(/^[0-9a-fA-F]+$/, 'Public key must be hexadecimal')

export const nostrProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  display_name: z.string().min(1).max(50).optional(),
  about: z.string().max(500).optional(),
  picture: z.string().url().optional().or(z.literal('')),
  banner: z.string().url().optional().or(z.literal('')),
  nip05: z.string().email().optional().or(z.literal('')),
  lud16: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
})

export const nostrPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty').max(5000, 'Post is too long'),
  tags: z.array(z.array(z.string())).optional(),
})

export const nostrMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(10000, 'Message is too long'),
  recipientPubkey: nostrPublicKeySchema,
})

export const relayUrlSchema = z.string()
  .url('Invalid relay URL')
  .startsWith('wss://', 'Relay URL must start with wss://')

export const zapAmountSchema = z.number()
  .int('Amount must be a whole number')
  .min(1, 'Amount must be at least 1 sat')
  .max(1000000, 'Amount cannot exceed 1,000,000 sats')

// Validation helper functions
export function validatePrivateKey(key: string): string {
  try {
    return nostrPrivateKeySchema.parse(key)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid private key', error.errors)
    }
    throw error
  }
}

export function validatePublicKey(key: string): string {
  try {
    return nostrPublicKeySchema.parse(key)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid public key', error.errors)
    }
    throw error
  }
}

export function validateProfile(profile: unknown): z.infer<typeof nostrProfileSchema> {
  try {
    return nostrProfileSchema.parse(profile)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid profile data', error.errors)
    }
    throw error
  }
}

export function validatePost(post: unknown): z.infer<typeof nostrPostSchema> {
  try {
    return nostrPostSchema.parse(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid post data', error.errors)
    }
    throw error
  }
}

export function validateMessage(message: unknown): z.infer<typeof nostrMessageSchema> {
  try {
    return nostrMessageSchema.parse(message)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid message data', error.errors)
    }
    throw error
  }
}

export function validateRelayUrl(url: string): string {
  try {
    return relayUrlSchema.parse(url)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid relay URL', error.errors)
    }
    throw error
  }
}

export function validateZapAmount(amount: number): number {
  try {
    return zapAmountSchema.parse(amount)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid zap amount', error.errors)
    }
    throw error
  }
}

// Sanitization helpers
export function sanitizeHtml(text: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/&/g, '&amp;')
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // Only allow http(s) and wss protocols
    if (!['http:', 'https:', 'wss:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}