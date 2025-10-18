import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NostrProvider } from "@/contexts/nostr-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Nostr Social Network",
    template: "%s | Nostr Social Network"
  },
  description: "Un réseau social décentralisé construit sur le protocole Nostr. Connectez-vous, partagez du contenu et interagissez de manière décentralisée.",
  keywords: ["nostr", "réseau social", "décentralisé", "cryptographie", "liberté d'expression"],
  authors: [{ name: "Nostr Social Network" }],
  creator: "Nostr Social Network",
  publisher: "Nostr Social Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nostr-social.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'Nostr Social Network',
    description: 'Un réseau social décentralisé construit sur le protocole Nostr',
    siteName: 'Nostr Social Network',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'Nostr Social Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nostr Social Network',
    description: 'Un réseau social décentralisé construit sur le protocole Nostr',
    images: ['/placeholder-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NostrProvider>
            {children}
            <Toaster />
          </NostrProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}