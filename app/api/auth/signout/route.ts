import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Signed out successfully",
    })
    response.cookies.set("auth-token", "", { maxAge: 0 })
    return response
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}