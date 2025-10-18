/**
 * Centralized error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class NostrError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 500)
    this.name = "NostrError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "AUTH_ERROR", 401)
    this.name = "AuthenticationError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400)
    this.name = "ValidationError"
  }
}

/**
 * Safely handle errors and provide user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "An unexpected error occurred"
}

/**
 * Log errors in development, send to error tracking in production
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`Error${context ? ` in ${context}` : ""}:`, error)
  } else {
    // In production, you might want to send errors to a service like Sentry
    // For now, we'll just log to console
    console.error("Production error:", {
      message: getErrorMessage(error),
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Validate Nostr public key format
 */
export function isValidNostrPublicKey(pubkey: string): boolean {
  // Hex format: 64 characters
  if (/^[0-9a-f]{64}$/i.test(pubkey)) {
    return true
  }
  
  // npub format
  if (pubkey.startsWith("npub1") && pubkey.length === 63) {
    return true
  }
  
  return false
}

/**
 * Validate Nostr private key format
 */
export function isValidNostrPrivateKey(privkey: string): boolean {
  // Hex format: 64 characters
  if (/^[0-9a-f]{64}$/i.test(privkey)) {
    return true
  }
  
  // nsec format
  if (privkey.startsWith("nsec1") && privkey.length === 63) {
    return true
  }
  
  return false
}
