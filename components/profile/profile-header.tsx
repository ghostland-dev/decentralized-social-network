"use client"

import { useState, useEffect } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Copy, Check } from "lucide-react"
import { EditProfileDialog } from "./edit-profile-dialog"
import { toast } from "sonner"
import type { NostrProfile } from "@/lib/nostr/types"

interface ProfileHeaderProps {
  pubkey: string
  isOwnProfile: boolean
  profile?: NostrProfile | null
}

export function ProfileHeader({ pubkey, isOwnProfile, profile: profileProp }: ProfileHeaderProps) {
  const { client } = useNostr()
  const [profile, setProfile] = useState<NostrProfile | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (profileProp) {
      setProfile(profileProp)
    }
  }, [profileProp])

  useEffect(() => {
    if (!client) return

    const loadProfile = async () => {
      const prof = await client.getProfile(pubkey)
      setProfile(prof)
    }

    loadProfile()
  }, [client, pubkey])

  const handleCopyPubkey = async () => {
    await navigator.clipboard.writeText(pubkey)
    setCopied(true)
    toast.success("Public key copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProfileUpdate = (updatedProfile: NostrProfile) => {
    setProfile(updatedProfile)
  }

  return (
    <>
      <Card className="overflow-hidden">
        {/* Banner */}
        <div
          className="h-48 bg-gradient-to-br from-primary to-accent"
          style={
            profile?.banner
              ? {
                  backgroundImage: `url(${profile.banner})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="relative -mt-20">
              {profile?.picture ? (
                <img
                  src={profile.picture || "/placeholder.svg"}
                  alt={profile?.name || "User"}
                  className="h-32 w-32 rounded-full border-4 border-background object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-background bg-gradient-to-br from-primary to-accent" />
              )}
            </div>

            {isOwnProfile && (
              <Button onClick={() => setShowEditDialog(true)} variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold">{profile?.display_name || profile?.name || "Anonymous"}</h1>
              {profile?.nip05 && <p className="text-sm text-muted-foreground">✓ {profile.nip05}</p>}
            </div>

            {profile?.about && <p className="text-sm">{profile.about}</p>}

            {profile?.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {profile.website}
              </a>
            )}

            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {pubkey.slice(0, 16)}...{pubkey.slice(-16)}
              </code>
              <Button variant="ghost" size="sm" onClick={handleCopyPubkey}>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {isOwnProfile && (
        <EditProfileDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          currentProfile={profile || {}}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  )
}
