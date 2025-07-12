import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToS3 } from "@/lib/utils"
import { getSupabaseServerClient } from "@/lib/supabaseServerClient"

export async function POST(request: NextRequest) {
  try {
    // Get bearer token from Authorization header
    const cookiesToken = request.cookies.get("auth-token")?.value
    const authHeader = request.headers.get("authorization")
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : cookiesToken
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 })
    }

    // Validate token and get user from Supabase
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }
    const user = { id: data.user.id, name: data.user.user_metadata?.full_name || data.user.email }
    console.log("Authenticated user:", user)

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
     const agentId = formData.get("agentId") as string
      const callId = formData.get("callId") as string
    const description = formData.get("description") as string
    console.log("Form data received:", { title, description, file })
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Upload to S3 using the utility function
    const s3Result = await uploadFileToS3(file, user)

    // Save video record to Supabase
    const { data: videoData, error: videoError } = await supabase
      .from("videos")
      .insert([
        {
          user_id: user.id,
          title,
          description,
          s3_url: s3Result.key,
          file_size: file.size,
          agent_id: agentId, // Add agentId if needed
          call_id: callId, // Add callId if needed
          status: "ready", // or "ready" if you proce
          // ss immediately
        },
      ])
      .select()
      .single()

    if (videoError) {
      console.error("Supabase insert error:", videoError)
      return NextResponse.json({ error: "Failed to save video record" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Video uploaded and saved successfully",
      video: videoData,
      url: s3Result.url,
      key: s3Result.key,
      mimetype: s3Result.mimetype,
      originalname: s3Result.originalname,
      title,
      description,
      user,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}