import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const response = NextResponse.json({
      message: "Account created successfully",
      user: data.user,
      session: data.session,
    })

    // Set access token as HTTP-only cookie if available
    if (data.session?.access_token) {
      response.cookies.set("auth-token", data.session.access_token, {
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
