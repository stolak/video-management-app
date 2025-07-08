"use client"

import { useState, useEffect } from "react"
import { Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Video {
  id: string
  title: string
  user: string
  userEmail: string
  status: string
  fileSize: string
  duration: string
  created: string
  url: string
}

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    // Mock data - replace with API call
    const mockVideos: Video[] = [
      {
        id: "1",
        title: "dcdf",
        user: "Stephen",
        userEmail: "stolaksoftech@yahoo.com",
        status: "ready",
        fileSize: "Unknown",
        duration: "Unknown",
        created: "7/8/2025",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
    ]

    setVideos(mockVideos)
    setLoading(false)
  }, [])

  const handleDelete = async (videoId: string) => {
    try {
      setVideos(videos.filter((v) => v.id !== videoId))
      toast.success("Video deleted successfully")
    } catch (error) {
      toast.error("Failed to delete video")
    }
  }

  if (loading) {
    return <div>Loading videos...</div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Videos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">File Size</th>
                  <th className="text-left py-3 px-4 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{video.title}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{video.user}</div>
                        <div className="text-sm text-gray-500">{video.userEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={video.status === "ready" ? "default" : "secondary"}
                        className={video.status === "ready" ? "bg-green-100 text-green-800" : ""}
                      >
                        {video.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{video.fileSize}</td>
                    <td className="py-3 px-4 text-gray-600">{video.duration}</td>
                    <td className="py-3 px-4 text-gray-600">{video.created}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(video)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Video</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{video.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(video.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="aspect-video">
              <video className="w-full h-full" controls autoPlay>
                <source src={selectedVideo.url} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
