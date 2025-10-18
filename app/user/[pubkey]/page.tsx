"use client"
import { logger } from "@/lib/logger"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useNostr } from "@/contexts/nostr-context"
import { Sidebar } from "@/components/layout/sidebar"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfilePosts } from "@/components/profile/profile-posts"
import { Spinner } from "@/components/ui/spinner"
import type { NostrProfile } from "@/lib/nostr/types"

export default function UserProfilePage() {
  const params = useParams()
  const { client } = useNostr()
  const [profile, setProfile] = useState<NostrProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const pubkey = params.pubkey as string

  useEffect(() => {
    if (!client || !pubkey) return

    const loadProfile = async () => {
      try {
        const userProfile = await client.getProfile(pubkey)
        setProfile(userProfile)
      } catch (error) {
        logger.error("Failed to load profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [client, pubkey])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            <ProfileHeader profile={profile} pubkey={pubkey} isOwnProfile={false} />
            <div className="max-w-2xl mx-auto px-6">
              <ProfilePosts pubkey={pubkey} profile={profile} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
