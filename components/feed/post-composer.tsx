"use client"
import { logger } from "@/lib/logger"

import { useState } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { NostrKind } from "@/lib/nostr/types"

export function PostComposer() {
  const { client, user } = useNostr()
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const handlePost = async () => {
    if (!content.trim() || !client || !user?.privkey) return

    setIsPosting(true)
    try {
      await client.publishEvent(
        {
          kind: NostrKind.Text,
          content: content.trim(),
          tags: [],
        },
        user.privkey,
      )

      toast.success("Post published!")
      setContent("")
    } catch (error) {
      toast.error("Failed to publish post")
      logger.error(error)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-0 focus-visible:ring-0 p-0 text-base"
            disabled={isPosting}
          />
          <div className="flex justify-end">
            <Button onClick={handlePost} disabled={!content.trim() || isPosting} size="sm">
              {isPosting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
