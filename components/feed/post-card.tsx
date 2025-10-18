"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Repeat2, MessageCircle, Share, Loader2, Zap } from "lucide-react"
import { useNostr } from "@/contexts/nostr-context"
import { usePostInteractions } from "@/hooks/use-post-interactions"
import { useZapCount } from "@/hooks/use-zap-count"
import { likePost, repostPost } from "@/lib/nostr/interactions"
import { CommentDialog } from "./comment-dialog"
import { ZapDialog } from "@/components/zaps/zap-dialog"
import { toast } from "sonner"
import type { NostrEvent, NostrProfile } from "@/lib/nostr/types"
import { cn } from "@/lib/utils"

interface PostCardProps {
  event: NostrEvent
  authorName?: string
  authorPicture?: string
  authorProfile?: NostrProfile
}

export function PostCard({ event, authorName, authorPicture, authorProfile }: PostCardProps) {
  const { client, user } = useNostr()
  const { interactions, loading } = usePostInteractions(event.id, event.pubkey)
  const { zapCount, loading: zapLoading } = useZapCount(event.id)
  const [isLiking, setIsLiking] = useState(false)
  const [isReposting, setIsReposting] = useState(false)
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [showZapDialog, setShowZapDialog] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(event.created_at * 1000), { addSuffix: true })
  const shortPubkey = `${event.pubkey.slice(0, 8)}...${event.pubkey.slice(-4)}`

  const handleLike = async () => {
    if (!client || !user?.privkey || interactions.isLikedByUser) return

    setIsLiking(true)
    try {
      await likePost(client, event.id, event.pubkey, user.privkey)
      toast.success("Post liked!")
    } catch (_error) {
      toast.error("Failed to like post")
    } finally {
      setIsLiking(false)
    }
  }

  const handleRepost = async () => {
    if (!client || !user?.privkey || interactions.isRepostedByUser) return

    setIsReposting(true)
    try {
      await repostPost(client, event, user.privkey)
      toast.success("Post reposted!")
    } catch (_error) {
      toast.error("Failed to repost")
    } finally {
      setIsReposting(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`nostr:${event.id}`)
      toast.success("Event ID copied to clipboard")
    } catch (_error) {
      toast.error("Failed to copy")
    }
  }

  return (
    <>
      <Card className="p-4 hover:bg-accent/5 transition-colors">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {authorPicture ? (
              <Image
                src={authorPicture}
                alt={authorName || "User"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{authorName || "Anonymous"}</span>
              <span className="text-xs text-muted-foreground">@{shortPubkey}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            <p className="text-sm whitespace-pre-wrap break-words mb-3">{event.content}</p>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => setShowCommentDialog(true)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{loading ? "-" : interactions.comments}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
                  interactions.isRepostedByUser && "text-green-500",
                )}
                onClick={handleRepost}
                disabled={isReposting || interactions.isRepostedByUser}
              >
                {isReposting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Repeat2 className="h-4 w-4 mr-1" />}
                <span className="text-xs">{loading ? "-" : interactions.reposts}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
                  interactions.isLikedByUser && "text-red-500",
                )}
                onClick={handleLike}
                disabled={isLiking || interactions.isLikedByUser}
              >
                {isLiking ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Heart className={cn("h-4 w-4 mr-1", interactions.isLikedByUser && "fill-current")} />
                )}
                <span className="text-xs">{loading ? "-" : interactions.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                onClick={() => setShowZapDialog(true)}
              >
                <Zap className="h-4 w-4 mr-1" />
                <span className="text-xs">{zapLoading ? "-" : zapCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <CommentDialog
        open={showCommentDialog}
        onOpenChange={setShowCommentDialog}
        eventId={event.id}
        eventAuthor={event.pubkey}
        originalContent={event.content}
      />

      <ZapDialog
        open={showZapDialog}
        onOpenChange={setShowZapDialog}
        recipientPubkey={event.pubkey}
        recipientLud16={authorProfile?.lud16}
        recipientName={authorName}
        eventId={event.id}
      />
    </>
  )
}
