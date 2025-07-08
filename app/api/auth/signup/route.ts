import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database - replace with real database
const users = [
  {
    id: 1,
    email: "demo@example.com",
    password: "password123",
    name: "Demo User",
  },
]

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password, // In real app, hash this password
      name: fullName,
    }

    users.push(newUser)

    // Create session token
    const token = `user_${newUser.id}_${Date.now()}`

    // Set cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
