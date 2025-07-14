import { getSupabaseServerClient } from "@/lib/supabaseServerClient"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from("videos").delete().eq("id", id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.log("Video deleted:", id)
    return NextResponse.json({
      message: "Video deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
