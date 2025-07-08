import VideoList from "@/components/video-list"
import VideoFilters from "@/components/video-filters"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
        <p className="text-gray-600">Manage and monitor uploaded videos</p>
      </div>

      <div className="mb-6">
        <VideoFilters />
      </div>

      <Suspense fallback={<VideoListSkeleton />}>
        <VideoList />
      </Suspense>
    </div>
  )
}

function VideoListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}
