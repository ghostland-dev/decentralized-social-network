"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface NewMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectUser: (pubkey: string) => void
}

export function NewMessageDialog({ open, onOpenChange, onSelectUser }: NewMessageDialogProps) {
  const [pubkey, setPubkey] = useState("")

  const handleStart = () => {
    if (!pubkey.trim()) {
      toast.error("Please enter a public key")
      return
    }

    // Basic validation - should be 64 hex characters
    if (!/^[0-9a-f]{64}$/i.test(pubkey.trim())) {
      toast.error("Invalid public key format")
      return
    }

    onSelectUser(pubkey.trim())
    setPubkey("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Enter the public key (hex format) of the person you want to message</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pubkey">Public Key (hex)</Label>
            <Input
              id="pubkey"
              placeholder="64 character hex public key"
              value={pubkey}
              onChange={(e) => setPubkey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleStart}>Start Conversation</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
