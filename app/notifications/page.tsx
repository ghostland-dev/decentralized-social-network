"use client"
import { logger } from "@/lib/logger"

import { useEffect, useState } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Heart, MessageCircle, Repeat2, Zap } from "lucide-react"
import type { NostrEvent, NostrProfile } from "@/lib/nostr/types"
import { NostrKind } from "@/lib/nostr/types"
import { formatDistanceToNow } from "date-fns"

type NotificationType = "like" | "repost" | "reply" | "zap" | "mention"

interface Notification {
  id: string
  type: NotificationType
  event: NostrEvent
  profile?: NostrProfile
  timestamp: number
}

export default function NotificationsPage() {
  const { client, user } = useNostr()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [profiles, setProfiles] = useState<Map<string, NostrProfile>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!client || !user) return

    const loadNotifications = async () => {
      try {
        // Subscribe to events that mention or interact with the user
        const sub = await client.subscribeToEvents(
          [
            // Reactions to user's posts
            { kinds: [NostrKind.Reaction], "#p": [user.pubkey], limit: 20 },
            // Replies to user's posts
            { kinds: [NostrKind.Text], "#p": [user.pubkey], limit: 20 },
            // Reposts
            { kinds: [NostrKind.Repost], "#p": [user.pubkey], limit: 20 },
            // Zaps
            { kinds: [NostrKind.Zap], "#p": [user.pubkey], limit: 20 },
          ],
          (event) => {
            // Determine notification type
            let type: NotificationType = "mention"
            if (event.kind === NostrKind.Reaction) type = "like"
            else if (event.kind === NostrKind.Repost) type = "repost"
            else if (event.kind === NostrKind.Zap) type = "zap"
            else if (event.kind === NostrKind.Text) type = "reply"

            const notification: Notification = {
              id: event.id,
              type,
              event,
              timestamp: event.created_at,
            }

            setNotifications((prev) => {
              if (prev.some((n) => n.id === event.id)) return prev
              return [notification, ...prev].sort((a, b) => b.timestamp - a.timestamp)
            })

            // Fetch author profile
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
        logger.error("Failed to load notifications:", error)
        setLoading(false)
      }
    }

    loadNotifications()
  }, [client, user])

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500 fill-red-500" />
      case "repost":
        return <Repeat2 className="h-5 w-5 text-green-500" />
      case "reply":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "zap":
        return <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
      default:
        return <MessageCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getNotificationText = (notification: Notification) => {
    const profile = profiles.get(notification.event.pubkey)
    const name = profile?.display_name || profile?.name || "Someone"

    switch (notification.type) {
      case "like":
        return `${name} liked your post`
      case "repost":
        return `${name} reposted your post`
      case "reply":
        return `${name} replied to your post`
      case "zap":
        return `${name} zapped your post`
      default:
        return `${name} mentioned you`
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-sm text-muted-foreground">Stay updated with your interactions</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No notifications yet</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const profile = profiles.get(notification.event.pubkey)
                return (
                  <Card key={notification.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 pt-1">{getNotificationIcon(notification.type)}</div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.picture || "/placeholder.svg"} />
                        <AvatarFallback>
                          {(profile?.display_name || profile?.name || "?")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{getNotificationText(notification)}</p>
                        {notification.type === "reply" && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.event.content}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.timestamp * 1000), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
