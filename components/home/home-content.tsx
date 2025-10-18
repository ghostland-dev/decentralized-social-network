"use client"

import { useState } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { LoginDialog } from "@/components/auth/login-dialog"
import { PostComposer } from "@/components/feed/post-composer"
import { FeedList } from "@/components/feed/feed-list"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export function HomeContent() {
  const { isAuthenticated } = useNostr()
  const [showLogin, setShowLogin] = useState(false)

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
                <Zap className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Welcome to Nostr</h1>
              <p className="text-lg text-muted-foreground">A decentralized social network where you own your data</p>
            </div>

            <div className="space-y-4 pt-4">
              <Button size="lg" onClick={() => setShowLogin(true)} className="w-full">
                Get Started
              </Button>
              <p className="text-xs text-muted-foreground">No email required. Your keys, your data, your network.</p>
            </div>
          </div>
        </div>
        <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
      </>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Home</h2>
        <p className="text-sm text-muted-foreground">Latest posts from the network</p>
      </div>

      <PostComposer />
      <FeedList />
    </div>
  )
}