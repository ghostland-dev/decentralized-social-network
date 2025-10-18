import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Page introuvable</h1>
        <p className="text-muted-foreground">La ressource demandée n’existe pas.</p>
        <Button asChild>
          <Link href="/">Retour à l’accueil</Link>
        </Button>
      </div>
    </div>
  )
}
