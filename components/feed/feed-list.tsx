"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useNostr } from "@/contexts/nostr-context"
import { PostCard } from "./post-card"
import { Spinner } from "@/components/ui/spinner"
import type { NostrEvent, NostrProfile } from "@/lib/nostr/types"
import { NostrKind } from "@/lib/nostr/types"
import { useInfiniteScroll } from "@/hooks/use-pagination"
import { logger } from "@/lib/logger"
import { Button } from "@/components/ui/button"

const POSTS_PER_PAGE = 20

export function FeedList() {
  const { client } = useNostr()
  const [profiles, setProfiles] = useState<Map<string, NostrProfile>>(new Map())
  const [initialLoading, setInitialLoading] = useState(true)
  const lastEventTime = useRef<number>(Math.floor(Date.now() / 1000))
  const loadedEventIds = useRef<Set<string>>(new Set())

  const loadMorePosts = useCallback(async (): Promise<NostrEvent[]> => {
    if (!client) return []

    try {
      const events = await client.queryEvents([{
        kinds: [NostrKind.Text],
        until: lastEventTime.current,
        limit: POSTS_PER_PAGE,
      }])

      // Filter out duplicates and sort by time
      const newPosts = events
        .filter(event => !loadedEventIds.current.has(event.id))
        .sort((a, b) => b.created_at - a.created_at)

      // Update tracking
      newPosts.forEach(post => {
        loadedEventIds.current.add(post.id)
      })

      if (newPosts.length > 0) {
        lastEventTime.current = newPosts[newPosts.length - 1].created_at - 1
      }

      // Fetch profiles for new posts
      const uniqueAuthors = [...new Set(newPosts.map(p => p.pubkey))]
      const profilePromises = uniqueAuthors
        .filter(pubkey => !profiles.has(pubkey))
        .map(async (pubkey) => {
          const profile = await client.getProfile(pubkey)
          return { pubkey, profile }
        })

      const profileResults = await Promise.allSettled(profilePromises)
      const newProfiles = new Map(profiles)
      
      profileResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.profile) {
          newProfiles.set(result.value.pubkey, result.value.profile)
        }
      })

      setProfiles(newProfiles)

      return newPosts
    } catch (error) {
      logger.error('Failed to load more posts', error)
      return []
    }
  }, [client, profiles])

  const {
    items: posts,
    loading,
    hasMore,
    error,
    loadMore
  } = useInfiniteScroll(loadMorePosts, {
    pageSize: POSTS_PER_PAGE
  })

  // Initial load
  useEffect(() => {
    if (!client || !initialLoading) return

    loadMore().finally(() => {
      setInitialLoading(false)
    })
  }, [client, loadMore, initialLoading])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!client) return

    const sub = client.subscribeToEvents(
      [
        {
          kinds: [NostrKind.Text],
          since: Math.floor(Date.now() / 1000),
        },
      ],
      (event) => {
        // Handle real-time updates
        if (!loadedEventIds.current.has(event.id)) {
          loadedEventIds.current.add(event.id)
          // This would need to be handled differently with the infinite scroll
          // For now, just log it
          logger.info('New real-time post received', { id: event.id })
        }
      },
    )

    return () => {
      sub.then(s => s.close())
    }
  }, [client])

  if (initialLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const profile = profiles.get(post.pubkey)
        return (
          <PostCard
            key={post.id}
            event={post}
            authorName={profile?.display_name || profile?.name}
            authorPicture={profile?.picture}
            authorProfile={profile}
          />
        )
      })}
      
      {error && (
        <div className="text-center py-4">
          <p className="text-sm text-destructive mb-2">Failed to load posts</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadMore()}
          >
            Try Again
          </Button>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center py-4">
          <Spinner className="h-6 w-6" />
        </div>
      )}
      
      {hasMore && !loading && !error && (
        <div className="flex justify-center py-4">
          <Button 
            variant="outline" 
            onClick={() => loadMore()}
          >
            Load More
          </Button>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No more posts to load</p>
        </div>
      )}
    </div>
  )
}
