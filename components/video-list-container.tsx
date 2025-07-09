"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import VideoList from "@/components/video-list"
import { Skeleton } from "@/components/ui/skeleton"
import VideoFilters from "@/components/video-filters"

function VideoListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

export default function VideoListContainer() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = async () => {
    const res = await fetch("/api/videos", { cache: "no-store" })
    if (res.ok) {
      setVideos(await res.json())
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVideos()
    const channel = supabase
      .channel("public:videos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        () => {
          fetchVideos()
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) return <VideoListSkeleton />
  return <VideoList videos={videos} />
}
