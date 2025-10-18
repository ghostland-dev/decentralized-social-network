"use client"

import { useState, useEffect } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { NostrKind } from "@/lib/nostr/types"

export function useZapCount(eventId: string) {
  const { client } = useNostr()
  const [zapCount, setZapCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!client) return

    const loadZaps = async () => {
      try {
        const sub = await client.subscribeToEvents(
          [
            {
              kinds: [NostrKind.Zap],
              "#e": [eventId],
            },
          ],
          (event) => {
            setZapCount((prev) => prev + 1)
          },
          () => {
            setLoading(false)
          },
        )

        return () => {
          sub.close()
        }
      } catch (error) {
        console.error("Failed to load zaps:", error)
        setLoading(false)
      }
    }

    loadZaps()
  }, [client, eventId])

  return { zapCount, loading }
}
