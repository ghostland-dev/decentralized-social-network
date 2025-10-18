"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useNostr } from "@/contexts/nostr-context"
import { commentOnPost } from "@/lib/nostr/interactions"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  eventAuthor: string
  originalContent: string
}

export function CommentDialog({ open, onOpenChange, eventId, eventAuthor, originalContent }: CommentDialogProps) {
  const { client, user } = useNostr()
  const [comment, setComment] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const handleComment = async () => {
    if (!comment.trim() || !client || !user?.privkey) return

    setIsPosting(true)
    try {
      await commentOnPost(client, eventId, eventAuthor, comment.trim(), user.privkey)
      toast.success("Comment posted!")
      setComment("")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to post comment")
      console.error(error)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply to post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-sm text-muted-foreground line-clamp-3">{originalContent}</p>
          </div>

          <Textarea
            placeholder="Write your reply..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isPosting}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPosting}>
              Cancel
            </Button>
            <Button onClick={handleComment} disabled={!comment.trim() || isPosting}>
              {isPosting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
