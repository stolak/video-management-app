
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse,} from "next/server"
import { getSupabaseServerClient } from "@/lib/supabaseServerClient"

export async function POST(req: Request) {
  try{

  const { access_token } = await req.json()

if (!access_token) {
  return NextResponse.json({ error: 'Missing token' }, { status: 401 })
}
 
    const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser(access_token)
  if (error || !data.user) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
  }
  
  const response = NextResponse.json({
      message: "Successfully signed in",
      user: data.user,
      token:access_token
    })
    // Set access token as HTTP-only cookie if available
    if (data.user) {
      response.cookies.set("auth-token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return response
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
