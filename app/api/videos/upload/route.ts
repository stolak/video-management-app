import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToS3 } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Dummy user object for demonstration; replace with real user/session
    const user = { id: "demo-user" }

    // Upload to S3 using the utility function
    const s3Result = await uploadFileToS3(file, user)

    // Optionally, save metadata to database here
    // ...existing code...c
    console.log("S3 upload result:", s3Result)
    return NextResponse.json({
      message: "Video uploaded successfully",
      url: s3Result.url,
      key: s3Result.key,
      mimetype: s3Result.mimetype,
      originalname: s3Result.originalname,
      title,
      description,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
