"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useNostr } from "@/contexts/nostr-context"
import { Sidebar } from "@/components/layout/sidebar"
import { PostCard } from "@/components/feed/post-card"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { NostrEvent, NostrProfile } from "@/lib/nostr/types"
import { NostrKind } from "@/lib/nostr/types"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { client } = useNostr()
  const [post, setPost] = useState<NostrEvent | null>(null)
  const [replies, setReplies] = useState<NostrEvent[]>([])
  const [profiles, setProfiles] = useState<Map<string, NostrProfile>>(new Map())
  const [loading, setLoading] = useState(true)

  const postId = params.id as string

  useEffect(() => {
    if (!client || !postId) return

    const loadPost = async () => {
      try {
        // Fetch the specific post
        const sub = await client.subscribeToEvents(
          [{ ids: [postId] }],
          (event) => {
            setPost(event)

            // Fetch author profile
            client.getProfile(event.pubkey).then((profile) => {
              if (profile) {
                setProfiles((prev) => new Map(prev).set(event.pubkey, profile))
              }
            })
          },
          () => {
            setLoading(false)
          },
        )

        // Fetch replies to this post
        const repliesSub = await client.subscribeToEvents(
          [
            {
              kinds: [NostrKind.Text],
              "#e": [postId],
              limit: 50,
            },
          ],
          (event) => {
            setReplies((prev) => {
              if (prev.some((r) => r.id === event.id)) return prev
              return [...prev, event].sort((a, b) => a.created_at - b.created_at)
            })

            // Fetch reply author profile
            if (!profiles.has(event.pubkey)) {
              client.getProfile(event.pubkey).then((profile) => {
                if (profile) {
                  setProfiles((prev) => new Map(prev).set(event.pubkey, profile))
                }
              })
            }
          },
        )

        return () => {
          sub.close()
          repliesSub.close()
        }
      } catch (error) {
        console.error("Failed to load post:", error)
        setLoading(false)
      }
    }

    loadPost()
  }, [client, postId])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : !post ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Post not found</p>
            </div>
          ) : (
            <div className="space-y-6">
              <PostCard
                event={post}
                authorName={profiles.get(post.pubkey)?.display_name || profiles.get(post.pubkey)?.name}
                authorPicture={profiles.get(post.pubkey)?.picture}
                authorProfile={profiles.get(post.pubkey)}
              />

              {replies.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Replies</h3>
                  {replies.map((reply) => {
                    const profile = profiles.get(reply.pubkey)
                    return (
                      <PostCard
                        key={reply.id}
                        event={reply}
                        authorName={profile?.display_name || profile?.name}
                        authorPicture={profile?.picture}
                        authorProfile={profile}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
