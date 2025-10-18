"use client"

import { useState } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Eye, EyeOff, LogOut } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function KeyManagement() {
  const { user, logout } = useNostr()
  const router = useRouter()
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copiedPub, setCopiedPub] = useState(false)
  const [copiedPriv, setCopiedPriv] = useState(false)

  const handleCopyPublic = async () => {
    if (!user?.pubkey) return
    await navigator.clipboard.writeText(user.pubkey)
    setCopiedPub(true)
    toast.success("Public key copied!")
    setTimeout(() => setCopiedPub(false), 2000)
  }

  const handleCopyPrivate = async () => {
    if (!user?.privkey) return
    await navigator.clipboard.writeText(user.privkey)
    setCopiedPriv(true)
    toast.success("Private key copied!")
    setTimeout(() => setCopiedPriv(false), 2000)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    toast.success("Logged out successfully")
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Public Key</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono break-all">{user?.pubkey}</code>
            <Button variant="outline" size="sm" onClick={handleCopyPublic}>
              {copiedPub ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your public key is safe to share. Others use it to find and interact with you on Nostr.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Private Key</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono break-all">
              {showPrivateKey ? user?.privkey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
            </code>
            <Button variant="outline" size="sm" onClick={() => setShowPrivateKey(!showPrivateKey)}>
              {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyPrivate}>
              {copiedPriv ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-xs text-destructive font-medium">
              Warning: Never share your private key with anyone! Anyone with access to your private key can control your
              account.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Account Actions</h2>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </Card>
    </div>
  )
}
