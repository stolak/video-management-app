"use client"

import VideoListContainer from "@/components/video-list-container"
import VideoFilters from "@/components/video-filters"
import { useState } from "react"

export default function Dashboard() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: {},
  })

  function handleFilterChange(newFilters: {
    search: string
    status: string
    dateRange: { from?: Date; to?: Date }
  }) {
    setFilters(newFilters)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
        <p className="text-gray-600">Manage and monitor uploaded videos</p>
      </div>

      <div className="mb-6">
        <VideoFilters onChange={handleFilterChange} />
      </div>

      <VideoListContainer filters={filters} />
    </div>
  )
}