import VideoListContainer from "@/components/video-list-container"
import VideoFilters from "@/components/video-filters"

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

      <VideoListContainer />
    </div>
  )
}