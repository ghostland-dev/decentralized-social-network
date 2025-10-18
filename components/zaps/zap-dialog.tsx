"use client"
import { logger } from "@/lib/logger"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useNostr } from "@/contexts/nostr-context"
import { createZapRequest, getLightningInvoice, openLightningWallet } from "@/lib/nostr/zaps"
import { Zap, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ZapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientPubkey: string
  recipientLud16?: string
  recipientName?: string
  eventId?: string
}

const PRESET_AMOUNTS = [1000, 5000, 10000, 50000, 100000] // in sats

export function ZapDialog({
  open,
  onOpenChange,
  recipientPubkey,
  recipientLud16,
  recipientName,
  eventId,
}: ZapDialogProps) {
  const { client, user } = useNostr()
  const [amount, setAmount] = useState(1000)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleZap = async () => {
    if (!client || !user?.privkey || !recipientLud16) {
      toast.error("Unable to send zap")
      return
    }

    setLoading(true)
    try {
      // Create zap request event
      const zapRequestEvent = await createZapRequest(
        client,
        {
          amount: amount * 1000, // Convert sats to millisats
          comment,
          recipientPubkey,
          eventId,
        },
        user.pubkey,
        user.privkey,
      )

      // Get lightning invoice
      const invoice = await getLightningInvoice(recipientLud16, amount * 1000, JSON.stringify(zapRequestEvent))

      if (!invoice) {
        toast.error("Failed to get lightning invoice")
        return
      }

      // Open lightning wallet
      openLightningWallet(invoice)
      toast.success("Opening lightning wallet...")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to send zap")
      logger.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!recipientLud16) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unable to Zap</DialogTitle>
            <DialogDescription>
              This user hasn't set up a Lightning address yet. They need to add a Lightning address (lud16) to their
              profile to receive zaps.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send a Zap</DialogTitle>
          <DialogDescription>
            Send sats to {recipientName || "this user"} via Lightning Network
            <br />
            <span className="text-xs font-mono">{recipientLud16}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount (sats)</Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(preset)}
                  className="text-xs"
                >
                  {preset >= 1000 ? `${preset / 1000}k` : preset}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Custom amount"
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a message with your zap..."
              className="min-h-[80px]"
            />
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm">
              <span className="font-semibold">Total:</span> {amount.toLocaleString()} sats
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleZap} disabled={loading || amount <= 0} className="bg-amber-500 hover:bg-amber-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Send Zap
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
