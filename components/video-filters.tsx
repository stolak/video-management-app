"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"

interface VideoFiltersProps {
  onChange: (filters: {
    search: string
    status: string
    dateRange: { from?: Date; to?: Date }
  }) => void
}

export default function VideoFilters({ onChange }: VideoFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Memoize onChange to avoid infinite loop
  const handleChange = useCallback(() => {
    onChange({ search: searchTerm, status, dateRange })
  }, [searchTerm, status, dateRange])

  useEffect(() => {
    handleChange()
  }, [handleChange])

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5" />
        <span className="font-medium">Filters</span>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search videos, descriptions, or users..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[260px] justify-start text-left font-normal"
            >
              {dateRange.from && dateRange.to
                ? `${format(dateRange.from, "yyyy-MM-dd")} - ${format(dateRange.to, "yyyy-MM-dd")}`
                : "Pick a date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange.from ? dateRange : undefined}
              onSelect={(range) => setDateRange(range ?? { from: undefined, to: undefined })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
