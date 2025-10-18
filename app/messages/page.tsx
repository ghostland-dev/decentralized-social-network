"use client"

import { useState } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { Sidebar } from "@/components/layout/sidebar"
import { ConversationList } from "@/components/messages/conversation-list"
import { MessageThread } from "@/components/messages/message-thread"
import { NewMessageDialog } from "@/components/messages/new-message-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function MessagesPage() {
  const { isAuthenticated } = useNostr()
  const [selectedPubkey, setSelectedPubkey] = useState<string | null>(null)
  const [showNewMessage, setShowNewMessage] = useState(false)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="flex h-screen">
          {/* Conversations sidebar */}
          <div className="w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Messages</h2>
              <Button size="sm" onClick={() => setShowNewMessage(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ConversationList selectedPubkey={selectedPubkey} onSelectConversation={setSelectedPubkey} />
          </div>

          {/* Message thread */}
          <div className="flex-1">
            {selectedPubkey ? (
              <MessageThread pubkey={selectedPubkey} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <NewMessageDialog open={showNewMessage} onOpenChange={setShowNewMessage} onSelectUser={setSelectedPubkey} />
    </div>
  )
}
