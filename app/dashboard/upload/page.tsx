import VideoUpload from "@/components/video-upload";
import PageHeader from "@/components/ui/page-header";

export default function UploadPage() {
  return (
    <div>
      <PageHeader
        title="Upload Video"
        subtitle="Upload a new video to your collection"
      />
      <div className="max-w-2xl">
        <VideoUpload />
      </div>
    </div>
  );
}
