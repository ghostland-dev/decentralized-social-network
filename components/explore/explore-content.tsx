"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedList } from "@/components/feed/feed-list"
import { Search, TrendingUp, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

export function ExploreContent() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Explore</h2>
        <p className="text-sm text-muted-foreground">Discover new content and people</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, users, hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="posts">
            <TrendingUp className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="people">
            <Users className="h-4 w-4 mr-2" />
            People
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <FeedList />
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <Card className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Trending topics coming soon</p>
          </Card>
        </TabsContent>

        <TabsContent value="people" className="mt-6">
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Suggested users coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}