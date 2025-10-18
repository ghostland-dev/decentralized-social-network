"use client"

import { generateSecretKey, getPublicKey } from "nostr-tools/pure"
import * as nip19 from "nostr-tools/nip19"
import { bytesToHex, hexToBytes } from "./encoding"

export function generateKeyPair() {
  const privateKey = generateSecretKey()
  const publicKey = getPublicKey(privateKey)

  return {
    privateKey: bytesToHex(privateKey),
    publicKey,
    nsec: nip19.nsecEncode(privateKey),
    npub: nip19.npubEncode(publicKey),
  }
}

export function getPublicKeyFromPrivate(privateKeyHex: string): string {
  return getPublicKey(hexToBytes(privateKeyHex))
}

export function decodeNsec(nsec: string): string {
  const decoded = nip19.decode(nsec)
  if (decoded.type !== "nsec") throw new Error("Invalid nsec")
  return bytesToHex(decoded.data)
}

export function decodeNpub(npub: string): string {
  const decoded = nip19.decode(npub)
  if (decoded.type !== "npub") throw new Error("Invalid npub")
  return decoded.data
}

export function saveKeysToLocalStorage(privateKey: string, publicKey: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("nostr_privkey", privateKey)
    localStorage.setItem("nostr_pubkey", publicKey)
  }
}

export function loadKeysFromLocalStorage(): { privateKey: string; publicKey: string } | null {
  if (typeof window === "undefined") return null

  const privateKey = localStorage.getItem("nostr_privkey")
  const publicKey = localStorage.getItem("nostr_pubkey")

  if (!privateKey || !publicKey) return null

  return { privateKey, publicKey }
}

export function clearKeysFromLocalStorage() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("nostr_privkey")
    localStorage.removeItem("nostr_pubkey")
  }
}
