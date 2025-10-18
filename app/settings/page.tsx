"use client"

import { useNostr } from "@/contexts/nostr-context"
import { Sidebar } from "@/components/layout/sidebar"
import { RelayManager } from "@/components/settings/relay-manager"
import { KeyManagement } from "@/components/settings/key-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const { isAuthenticated } = useNostr()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <Tabs defaultValue="relays" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="relays">Relays</TabsTrigger>
              <TabsTrigger value="keys">Keys & Security</TabsTrigger>
            </TabsList>

            <TabsContent value="relays" className="mt-6">
              <RelayManager />
            </TabsContent>

            <TabsContent value="keys" className="mt-6">
              <KeyManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
