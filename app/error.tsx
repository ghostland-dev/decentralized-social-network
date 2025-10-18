"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
          <p className="text-muted-foreground">{error.message || "Veuillez réessayer."}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => reset()}>Réessayer</Button>
            <Button variant="outline" asChild>
              <Link href="/">Retour à l’accueil</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
