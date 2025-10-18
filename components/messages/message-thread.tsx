"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { NostrKind, type NostrProfile } from "@/lib/nostr/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Send, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  timestamp: number
  fromMe: boolean
  decrypted: boolean
}

interface MessageThreadProps {
  pubkey: string
}

export function MessageThread({ pubkey }: MessageThreadProps) {
  const { client, user } = useNostr()
  const [messages, setMessages] = useState<Message[]>([])
  const [profile, setProfile] = useState<NostrProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!client || !user) return

    const loadMessages = async () => {
      setLoading(true)
      setMessages([])

      try {
        // Load profile
        const prof = await client.getProfile(pubkey)
        setProfile(prof)

        const messageMap = new Map<string, Message>()

        const sub = await client.subscribeToEvents(
          [
            {
              kinds: [NostrKind.EncryptedDirectMessage],
              authors: [user.pubkey],
              "#p": [pubkey],
            },
            {
              kinds: [NostrKind.EncryptedDirectMessage],
              authors: [pubkey],
              "#p": [user.pubkey],
            },
          ],
          async (event) => {
            if (messageMap.has(event.id)) return

            try {
              const decrypted = await client.decryptMessage(
                event.content,
                event.pubkey === user.pubkey ? pubkey : event.pubkey,
                user.privkey!,
              )

              messageMap.set(event.id, {
                id: event.id,
                content: decrypted,
                timestamp: event.created_at,
                fromMe: event.pubkey === user.pubkey,
                decrypted: true,
              })

              setMessages(Array.from(messageMap.values()).sort((a, b) => a.timestamp - b.timestamp))
            } catch (error) {
              console.error("Failed to decrypt message:", error)
              messageMap.set(event.id, {
                id: event.id,
                content: "[Failed to decrypt]",
                timestamp: event.created_at,
                fromMe: event.pubkey === user.pubkey,
                decrypted: false,
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
        console.error("Failed to load messages:", error)
        setLoading(false)
      }
    }

    loadMessages()
  }, [client, user, pubkey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !client || !user?.privkey) return

    setSending(true)
    try {
      const encrypted = await client.encryptMessage(newMessage.trim(), pubkey, user.privkey)

      await client.publishEvent(
        {
          kind: NostrKind.EncryptedDirectMessage,
          content: encrypted,
          tags: [["p", pubkey]],
        },
        user.privkey,
      )

      setNewMessage("")
    } catch (error) {
      toast.error("Failed to send message")
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        {profile?.picture ? (
          <img src={profile.picture || "/placeholder.svg"} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
        )}
        <div>
          <h3 className="font-semibold">{profile?.display_name || profile?.name || "Anonymous"}</h3>
          <p className="text-xs text-muted-foreground">
            {pubkey.slice(0, 8)}...{pubkey.slice(-4)}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-6 w-6" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.fromMe ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2",
                  msg.fromMe ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={cn("text-xs mt-1", msg.fromMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {formatDistanceToNow(new Date(msg.timestamp * 1000), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <Button onClick={handleSend} disabled={!newMessage.trim() || sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
