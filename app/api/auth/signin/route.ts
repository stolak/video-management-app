import { NextResponse,} from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabaseClient"
import { getSupabaseServerClient } from "@/lib/supabaseServerClient"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // const { data, error } = await getSupabaseServerClient.arguments({
    //   email,
    //   password,
    // })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
        // Save token to localStorage

          console.log("Sign in data:", data)

         const response = NextResponse.json({
      message: "Successfully signed in",
      user: data.user,
      session: data.session,
      token:data.session.access_token
    })
console.log("Response data:", response)
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
