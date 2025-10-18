"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNostr } from "@/contexts/nostr-context"
import { generateKeyPair, decodeNsec } from "@/lib/nostr/keys"
import { Key, Sparkles, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useNostr()
  const [privateKey, setPrivateKey] = useState("")
  const [generatedKeys, setGeneratedKeys] = useState<ReturnType<typeof generateKeyPair> | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGenerateKeys = () => {
    const keys = generateKeyPair()
    setGeneratedKeys(keys)
  }

  const handleCopyKeys = async () => {
    if (!generatedKeys) return

    const keysText = `Private Key (nsec): ${generatedKeys.nsec}\nPublic Key (npub): ${generatedKeys.npub}\n\n⚠️ KEEP YOUR PRIVATE KEY SAFE! Never share it with anyone.`

    await navigator.clipboard.writeText(keysText)
    setCopied(true)
    toast.success("Keys copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogin = async (privKey: string) => {
    setLoading(true)
    try {
      let processedKey = privKey.trim()

      if (processedKey.startsWith("nsec")) {
        processedKey = decodeNsec(processedKey)
      }

      await login(processedKey)
      toast.success("Successfully logged in!")
      onOpenChange(false)
    } catch (_error) {
      toast.error("Invalid private key")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Nostr</DialogTitle>
          <DialogDescription>Connect with your Nostr keys or create a new identity</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="create">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privkey">Private Key (nsec or hex)</Label>
              <Input
                id="privkey"
                type="password"
                placeholder="nsec1... or hex private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>
            <Button onClick={() => handleLogin(privateKey)} disabled={!privateKey || loading} className="w-full">
              <Key className="mr-2 h-4 w-4" />
              {loading ? "Connecting..." : "Login"}
            </Button>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            {!generatedKeys ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate a new Nostr identity. Your keys will be created locally and never sent to any server.
                </p>
                <Button onClick={handleGenerateKeys} className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate New Keys
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Public Key (npub)</Label>
                    <p className="text-sm font-mono break-all mt-1">{generatedKeys.npub}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Private Key (nsec)</Label>
                    <p className="text-sm font-mono break-all mt-1">{generatedKeys.nsec}</p>
                  </div>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-xs text-destructive font-medium">
                    ⚠️ Save your private key securely! You&apos;ll need it to access your account. If you lose it, you&apos;ll lose
                    access forever.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCopyKeys} variant="outline" className="flex-1 bg-transparent">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Keys"}
                  </Button>
                  <Button onClick={() => handleLogin(generatedKeys.privateKey)} disabled={loading} className="flex-1">
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
