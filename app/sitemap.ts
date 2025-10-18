import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    { url: `${base}/explore`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/notifications`, changeFrequency: "hourly", priority: 0.3 },
    { url: `${base}/messages`, changeFrequency: "hourly", priority: 0.3 },
    { url: `${base}/profile`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/settings`, changeFrequency: "monthly", priority: 0.2 },
  ]

  // Note: For dynamic routes (user profiles, posts), you would fetch IDs from your backend/relays
  // and append to this list. As we depend on Nostr relays without a DB, we keep static items only.

  return routes
}
