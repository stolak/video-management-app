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

interface VideoListContainerProps {
  filters: {
    search: string
    status: string
    dateRange: { from?: Date; to?: Date }
  }
}

export default function VideoListContainer({ filters }: VideoListContainerProps) {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = async () => {
    const params = new URLSearchParams()
    if (filters.status && filters.status !== "all") params.append("status", filters.status)
    if (filters.dateRange?.from) params.append("startDate", filters.dateRange.from.toISOString().slice(0, 10))
    if (filters.dateRange?.to) params.append("endDate", filters.dateRange.to.toISOString().slice(0, 10))
    if (filters.search) params.append("search", filters.search)
    const res = await fetch(`/api/videos?${params.toString()}`, { cache: "no-store" })
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
  }, [filters])

  if (loading) return <VideoListSkeleton />
  return <VideoList videos={videos} />
}
