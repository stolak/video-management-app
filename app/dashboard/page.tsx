"use client"

import VideoListContainer from "@/components/video-list-container"
import VideoFilters from "@/components/video-filters"
import { useState } from "react"
import PageHeader from "@/components/ui/page-header"

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
      <PageHeader title="Video Management" subtitle="Manage and monitor uploaded videos" />
      <div className="mb-6">
        <VideoFilters onChange={handleFilterChange} />
      </div>
      <VideoListContainer filters={filters} />
    </div>
  )
}