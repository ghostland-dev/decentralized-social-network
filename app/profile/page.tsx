"use client"

import { useNostr } from "@/contexts/nostr-context"
import { Sidebar } from "@/components/layout/sidebar"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfilePosts } from "@/components/profile/profile-posts"

export default function ProfilePage() {
  const { isAuthenticated, user } = useNostr()

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="max-w-2xl mx-auto">
          <ProfileHeader pubkey={user.pubkey} isOwnProfile={true} />
          <ProfilePosts pubkey={user.pubkey} />
        </div>
      </main>
    </div>
  )
}
