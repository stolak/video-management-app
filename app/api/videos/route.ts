import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabaseServerClient"
import { getS3SignedUrl } from "@/lib/utils" // Uncomment and use if you want to generate signed URLs here

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (key) {
      const url = await getS3SignedUrl(key);
      return NextResponse.json({ url });
    }

    const supabase = getSupabaseServerClient()
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let query = supabase.from("videos").select("*")

    if (status) {
      query = query.eq("status", status)
    }
    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}