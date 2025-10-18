"use client"

import { useState } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { NostrRelay } from "@/lib/nostr/types"

export function RelayManager() {
  const { user, updateRelays } = useNostr()
  const [relays, setRelays] = useState<NostrRelay[]>(user?.relays || [])
  const [newRelayUrl, setNewRelayUrl] = useState("")

  const handleAddRelay = () => {
    if (!newRelayUrl.trim()) {
      toast.error("Please enter a relay URL")
      return
    }

    if (!newRelayUrl.startsWith("wss://") && !newRelayUrl.startsWith("ws://")) {
      toast.error("Relay URL must start with wss:// or ws://")
      return
    }

    if (relays.some((r) => r.url === newRelayUrl)) {
      toast.error("Relay already added")
      return
    }

    const newRelay: NostrRelay = {
      url: newRelayUrl.trim(),
      read: true,
      write: true,
    }

    const updatedRelays = [...relays, newRelay]
    setRelays(updatedRelays)
    updateRelays(updatedRelays)
    setNewRelayUrl("")
    toast.success("Relay added!")
  }

  const handleRemoveRelay = (url: string) => {
    const updatedRelays = relays.filter((r) => r.url !== url)
    setRelays(updatedRelays)
    updateRelays(updatedRelays)
    toast.success("Relay removed!")
  }

  const handleToggleRead = (url: string) => {
    const updatedRelays = relays.map((r) => (r.url === url ? { ...r, read: !r.read } : r))
    setRelays(updatedRelays)
    updateRelays(updatedRelays)
  }

  const handleToggleWrite = (url: string) => {
    const updatedRelays = relays.map((r) => (r.url === url ? { ...r, write: !r.write } : r))
    setRelays(updatedRelays)
    updateRelays(updatedRelays)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Add Relay</h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="wss://relay.example.com"
              value={newRelayUrl}
              onChange={(e) => setNewRelayUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddRelay()}
            />
          </div>
          <Button onClick={handleAddRelay}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Connected Relays</h2>
        <div className="space-y-4">
          {relays.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No relays configured</p>
          ) : (
            relays.map((relay) => (
              <div key={relay.url} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate">{relay.url}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`read-${relay.url}`} className="text-xs">
                      Read
                    </Label>
                    <Switch
                      id={`read-${relay.url}`}
                      checked={relay.read}
                      onCheckedChange={() => handleToggleRead(relay.url)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor={`write-${relay.url}`} className="text-xs">
                      Write
                    </Label>
                    <Switch
                      id={`write-${relay.url}`}
                      checked={relay.write}
                      onCheckedChange={() => handleToggleWrite(relay.url)}
                    />
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => handleRemoveRelay(relay.url)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
