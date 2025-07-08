import VideoUpload from "@/components/video-upload"

export default function UploadPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
        <p className="text-gray-600">Upload a new video to your collection</p>
      </div>

      <div className="max-w-2xl">
        <VideoUpload />
      </div>
    </div>
  )
}
