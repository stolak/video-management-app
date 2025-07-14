import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabaseServerClient"

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json()
    const supabase = getSupabaseServerClient()

    // 1. Create user in Supabase Auth (admin API)
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (userError || !userData?.user) {
      return NextResponse.json({ error: userError?.message || "Signup failed" }, { status: 400 })
    }

    // 2. Create profile in 'profiles' table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        user_id: userData.user.id,
        email,
        full_name,
      },
    ])

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Signup successful" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
