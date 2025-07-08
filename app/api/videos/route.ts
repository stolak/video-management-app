import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const mockVideos = [
  {
    id: "1",
    title: "Sample Video 1",
    description: "This is a sample video for demonstration",
    filename: "sample1.mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    size: 15728640, // 15MB
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sample Video 2",
    description: "Another sample video",
    filename: "sample2.mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    size: 25165824, // 24MB
    uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

export async function GET() {
  try {
    // In a real app, fetch from your database
    // const videos = await db.select().from(videosTable)

    return NextResponse.json(mockVideos)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
