"use client"

import type NostrClient from "./client"
import { NostrKind } from "./types"

export interface ZapRequest {
  amount: number // in millisats
  comment?: string
  recipientPubkey: string
  eventId?: string
}

export async function createZapRequest(
  client: NostrClient,
  request: ZapRequest,
  senderPubkey: string,
  privateKey: string,
) {
  const tags: string[][] = [
    ["p", request.recipientPubkey],
    ["amount", request.amount.toString()],
    ["relays", "wss://relay.damus.io", "wss://relay.nostr.band"],
  ]

  if (request.eventId) {
    tags.push(["e", request.eventId])
  }

  return await client.publishEvent(
    {
      kind: NostrKind.ZapRequest,
      content: request.comment || "",
      tags,
    },
    privateKey,
  )
}

export async function getLightningInvoice(lud16: string, amount: number, zapRequest: string): Promise<string | null> {
  try {
    // Parse lightning address
    const [name, domain] = lud16.split("@")
    if (!name || !domain) return null

    // Fetch LNURL
    const lnurlResponse = await fetch(`https://${domain}/.well-known/lnurlp/${name}`)
    if (!lnurlResponse.ok) return null

    const lnurlData = await lnurlResponse.json()
    if (!lnurlData.callback) return null

    // Request invoice
    const invoiceUrl = new URL(lnurlData.callback)
    invoiceUrl.searchParams.set("amount", amount.toString())
    invoiceUrl.searchParams.set("nostr", zapRequest)

    const invoiceResponse = await fetch(invoiceUrl.toString())
    if (!invoiceResponse.ok) return null

    const invoiceData = await invoiceResponse.json()
    return invoiceData.pr || null
  } catch (error) {
    console.error("Failed to get lightning invoice:", error)
    return null
  }
}

interface WebLN {
  enable: () => Promise<void>
  sendPayment: (invoice: string) => Promise<unknown>
}

export function openLightningWallet(invoice: string) {
  // Try to open with WebLN first
  if (typeof window !== "undefined" && (window as { webln?: WebLN }).webln) {
    const webln = (window as unknown as { webln: WebLN }).webln
    webln
      .enable()
      .then(() => {
        return webln.sendPayment(invoice)
      })
      .catch((_error: unknown) => {
        // Fallback to lightning: URI
        window.location.href = `lightning:${invoice}`
      })
  } else {
    // Fallback to lightning: URI
    window.location.href = `lightning:${invoice}`
  }
}

export async function getZapCount(_client: NostrClient, _eventId: string): Promise<number> {
  // This is a simplified version - in production you'd want to cache these
  // and subscribe to updates
  return 0
}
