"use client"

import type NostrClient from "./client"
import { NostrKind, type NostrEvent } from "./types"

export async function likePost(client: NostrClient, eventId: string, eventAuthor: string, privateKey: string) {
  return await client.publishEvent(
    {
      kind: NostrKind.Reaction,
      content: "+",
      tags: [
        ["e", eventId],
        ["p", eventAuthor],
      ],
    },
    privateKey,
  )
}

export async function repostPost(client: NostrClient, event: NostrEvent, privateKey: string) {
  return await client.publishEvent(
    {
      kind: NostrKind.Repost,
      content: JSON.stringify(event),
      tags: [
        ["e", event.id],
        ["p", event.pubkey],
      ],
    },
    privateKey,
  )
}

export async function commentOnPost(
  client: NostrClient,
  eventId: string,
  eventAuthor: string,
  content: string,
  privateKey: string,
) {
  return await client.publishEvent(
    {
      kind: NostrKind.Text,
      content,
      tags: [
        ["e", eventId, "", "reply"],
        ["p", eventAuthor],
      ],
    },
    privateKey,
  )
}

export interface PostInteractions {
  likes: number
  reposts: number
  comments: number
  isLikedByUser: boolean
  isRepostedByUser: boolean
}

export async function getPostInteractions(
  client: NostrClient,
  eventId: string,
  userPubkey?: string,
): Promise<PostInteractions> {
  const interactions: PostInteractions = {
    likes: 0,
    reposts: 0,
    comments: 0,
    isLikedByUser: false,
    isRepostedByUser: false,
  }

  // This is a simplified version - in production you'd want to cache these
  // and subscribe to updates
  return interactions
}
