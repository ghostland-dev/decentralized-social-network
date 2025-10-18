"use client"

import { useState, useEffect } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { NostrKind, type NostrProfile } from "@/lib/nostr/types"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

interface Conversation {
  pubkey: string
  lastMessage: string
  timestamp: number
  profile?: NostrProfile
}

interface ConversationListProps {
  selectedPubkey: string | null
  onSelectConversation: (pubkey: string) => void
}

export function ConversationList({ selectedPubkey, onSelectConversation }: ConversationListProps) {
  const { client, user } = useNostr()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!client || !user) return

    const loadConversations = async () => {
      try {
        const conversationMap = new Map<string, Conversation>()

        const sub = await client.subscribeToEvents(
          [
            {
              kinds: [NostrKind.EncryptedDirectMessage],
              authors: [user.pubkey],
              limit: 100,
            },
            {
              kinds: [NostrKind.EncryptedDirectMessage],
              "#p": [user.pubkey],
              limit: 100,
            },
          ],
          (event) => {
            const otherPubkey = event.pubkey === user.pubkey ? event.tags.find((t) => t[0] === "p")?.[1] : event.pubkey

            if (!otherPubkey) return

            const existing = conversationMap.get(otherPubkey)
            if (!existing || event.created_at > existing.timestamp) {
              conversationMap.set(otherPubkey, {
                pubkey: otherPubkey,
                lastMessage: event.content,
                timestamp: event.created_at,
              })
            }
          },
          async () => {
            const convs = Array.from(conversationMap.values()).sort((a, b) => b.timestamp - a.timestamp)

            // Load profiles
            for (const conv of convs) {
              const profile = await client.getProfile(conv.pubkey)
              if (profile) {
                conv.profile = profile
              }
            }

            setConversations(convs)
            setLoading(false)
          },
        )

        return () => {
          sub.close()
        }
      } catch (error) {
        console.error("Failed to load conversations:", error)
        setLoading(false)
      }
    }

    loadConversations()
  }, [client, user])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <p className="text-sm text-muted-foreground text-center">No conversations yet. Start a new message!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.pubkey}
          onClick={() => onSelectConversation(conv.pubkey)}
          className={cn(
            "w-full p-4 flex gap-3 hover:bg-accent/50 transition-colors border-b border-border text-left",
            selectedPubkey === conv.pubkey && "bg-accent",
          )}
        >
          <div className="flex-shrink-0">
            {conv.profile?.picture ? (
              <img
                src={conv.profile.picture || "/placeholder.svg"}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm truncate">
                {conv.profile?.display_name || conv.profile?.name || "Anonymous"}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(conv.timestamp * 1000), { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
