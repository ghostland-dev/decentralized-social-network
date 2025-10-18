"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useNostr } from "@/contexts/nostr-context"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { NostrProfile } from "@/lib/nostr/types"
import { logger } from "@/lib/logger"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentProfile: NostrProfile
  onProfileUpdate: (profile: NostrProfile) => void
}

export function EditProfileDialog({ open, onOpenChange, currentProfile, onProfileUpdate }: EditProfileDialogProps) {
  const { updateProfile } = useNostr()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<NostrProfile>({
    name: currentProfile.name || "",
    display_name: currentProfile.display_name || "",
    about: currentProfile.about || "",
    picture: currentProfile.picture || "",
    banner: currentProfile.banner || "",
    website: currentProfile.website || "",
    nip05: currentProfile.nip05 || "",
    lud16: currentProfile.lud16 || "",
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(formData)
      onProfileUpdate(formData)
      toast.success("Profile updated!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update profile")
      logger.error('Failed to update profile', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">Bio</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Tell us about yourself"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Profile Picture URL</Label>
            <Input
              id="picture"
              value={formData.picture}
              onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Banner Image URL</Label>
            <Input
              id="banner"
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nip05">NIP-05 Identifier</Label>
            <Input
              id="nip05"
              value={formData.nip05}
              onChange={(e) => setFormData({ ...formData, nip05: e.target.value })}
              placeholder="you@domain.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lud16">Lightning Address</Label>
            <Input
              id="lud16"
              value={formData.lud16}
              onChange={(e) => setFormData({ ...formData, lud16: e.target.value })}
              placeholder="you@getalby.com"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
