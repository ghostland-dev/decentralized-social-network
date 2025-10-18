"use client"

import { useEffect, useState } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { PostCard } from "./post-card"
import { Spinner } from "@/components/ui/spinner"
import type { NostrEvent, NostrProfile } from "@/lib/nostr/types"
import { NostrKind } from "@/lib/nostr/types"

export function FeedList() {
  const { client } = useNostr()
  const [posts, setPosts] = useState<NostrEvent[]>([])
  const [profiles, setProfiles] = useState<Map<string, NostrProfile>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!client) return

    const loadFeed = async () => {
      try {
        // Subscribe to recent text posts
        const sub = await client.subscribeToEvents(
          [
            {
              kinds: [NostrKind.Text],
              limit: 50,
            },
          ],
          (event) => {
            setPosts((prev) => {
              // Avoid duplicates
              if (prev.some((p) => p.id === event.id)) return prev
              // Add new post and sort by timestamp
              return [event, ...prev].sort((a, b) => b.created_at - a.created_at)
            })

            // Fetch author profile if we don't have it
            if (!profiles.has(event.pubkey)) {
              client.getProfile(event.pubkey).then((profile) => {
                if (profile) {
                  setProfiles((prev) => new Map(prev).set(event.pubkey, profile))
                }
              })
            }
          },
          () => {
            setLoading(false)
          },
        )

        return () => {
          sub.close()
        }
      } catch (error) {
        console.error("Failed to load feed:", error)
        setLoading(false)
      }
    }

    loadFeed()
  }, [client])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const profile = profiles.get(post.pubkey)
        return (
          <PostCard
            key={post.id}
            event={post}
            authorName={profile?.display_name || profile?.name}
            authorPicture={profile?.picture}
            authorProfile={profile}
          />
        )
      })}
    </div>
  )
}
