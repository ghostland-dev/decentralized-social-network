'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="space-y-2">
              <AlertTriangle className="w-16 h-16 mx-auto text-destructive" />
              <h1 className="text-2xl font-semibold text-foreground">
                Erreur critique
              </h1>
              <p className="text-muted-foreground">
                Une erreur critique s'est produite. Veuillez recharger la page.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Recharger
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}