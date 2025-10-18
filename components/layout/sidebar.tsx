"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Mail, Bell, User, Settings, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNostr } from "@/contexts/nostr-context"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Messages", href: "/messages", icon: Mail },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useNostr()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Nostr</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.profile?.display_name || user.profile?.name || "Anonymous"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.pubkey.slice(0, 8)}...{user.pubkey.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
