"use client"

// Hex encoding/decoding utilities to avoid depending on @noble/hashes/utils

export function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex
  if (normalized.length % 2 !== 0) {
    throw new Error("Invalid hex string length")
  }
  const length = normalized.length / 2
  const result = new Uint8Array(length)
  for (let i = 0; i < length; i += 1) {
    const byte = normalized.slice(i * 2, i * 2 + 2)
    const value = Number.parseInt(byte, 16)
    if (Number.isNaN(value)) {
      throw new Error("Invalid hex string content")
    }
    result[i] = value
  }
  return result
}

export function bytesToHex(bytes: Uint8Array): string {
  let out = ""
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i].toString(16).padStart(2, "0")
  }
  return out
}
