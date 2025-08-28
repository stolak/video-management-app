import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/keys - list all keys
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("keys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch keys" },
      { status: 500 }
    );
  }
}

// POST /api/keys - create new key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookiesToken = request.cookies.get("auth-token")?.value;
    const authHeader = request.headers.get("authorization");
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : cookiesToken;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Validate token and get user from Supabase
    const supabase = getSupabaseServerClient();
    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);
    if (userError || !userData) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    const user = {
      id: userData.user.id,
      name: userData.user.user_metadata?.full_name || userData.user.email,
    };

    const { description, key, user_id, status = true } = body;
    if (!description || !key) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("keys")
      .insert([{ description, key, user_id: user.id, status }])
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create key" },
      { status: 500 }
    );
  }
}
