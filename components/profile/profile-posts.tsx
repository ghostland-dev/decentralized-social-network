"use client"

import { useState, useEffect } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { PostCard } from "@/components/feed/post-card"
import { Spinner } from "@/components/ui/spinner"
import { NostrKind, type NostrEvent, type NostrProfile } from "@/lib/nostr/types"

interface ProfilePostsProps {
  pubkey: string
  profile?: NostrProfile | null
}

export function ProfilePosts({ pubkey, profile: initialProfile }: ProfilePostsProps) {
  const { client } = useNostr()
  const [posts, setPosts] = useState<NostrEvent[]>([])
  const [profile, setProfile] = useState<NostrProfile | null>(initialProfile || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!client) return

    const loadPosts = async () => {
      try {
        if (!initialProfile) {
          const prof = await client.getProfile(pubkey)
          setProfile(prof)
        }

        const sub = await client.subscribeToEvents(
          [
            {
              kinds: [NostrKind.Text],
              authors: [pubkey],
              limit: 50,
            },
          ],
          (event) => {
            setPosts((prev) => {
              if (prev.some((p) => p.id === event.id)) return prev
              return [event, ...prev].sort((a, b) => b.created_at - a.created_at)
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
        console.error("Failed to load posts:", error)
        setLoading(false)
      }
    }

    loadPosts()
  }, [client, pubkey, initialProfile])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-bold px-6">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              event={post}
              authorName={profile?.display_name || profile?.name}
              authorPicture={profile?.picture}
              authorProfile={profile || undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
