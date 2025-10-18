"use client"

import { useState, useEffect } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { NostrKind } from "@/lib/nostr/types"

interface PostInteractions {
  likes: number
  reposts: number
  comments: number
  isLikedByUser: boolean
  isRepostedByUser: boolean
}

export function usePostInteractions(eventId: string, eventAuthor: string) {
  const { client, user } = useNostr()
  const [interactions, setInteractions] = useState<PostInteractions>({
    likes: 0,
    reposts: 0,
    comments: 0,
    isLikedByUser: false,
    isRepostedByUser: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!client) return

    const loadInteractions = async () => {
      try {
        const sub = await client.subscribeToEvents(
          [
            {
              kinds: [NostrKind.Reaction, NostrKind.Repost, NostrKind.Text],
              "#e": [eventId],
            },
          ],
          (event) => {
            setInteractions((prev) => {
              const newInteractions = { ...prev }

              if (event.kind === NostrKind.Reaction && event.content === "+") {
                newInteractions.likes++
                if (user && event.pubkey === user.pubkey) {
                  newInteractions.isLikedByUser = true
                }
              } else if (event.kind === NostrKind.Repost) {
                newInteractions.reposts++
                if (user && event.pubkey === user.pubkey) {
                  newInteractions.isRepostedByUser = true
                }
              } else if (event.kind === NostrKind.Text) {
                // Check if it's a reply
                const isReply = event.tags.some((tag: string[]) => tag[0] === "e" && tag[3] === "reply")
                if (isReply) {
                  newInteractions.comments++
                }
              }

              return newInteractions
            })
          },
          () => {
            setLoading(false)
          },
        )

        return () => {
          sub.close()
        }
      } catch (error) {
        console.error("Failed to load interactions:", error)
        setLoading(false)
      }
    }

    loadInteractions()
  }, [client, eventId, user])

  return { interactions, loading }
}
