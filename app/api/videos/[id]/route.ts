import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, delete from database and blob storage
    // await db.delete(videosTable).where(eq(videosTable.id, id))
    // await del(videoUrl) // Delete from blob storage

    console.log("Video deleted:", id)

    return NextResponse.json({
      message: "Video deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
