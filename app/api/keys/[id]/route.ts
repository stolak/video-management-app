import { getSupabaseServerClient } from "@/lib/supabaseServerClient";
import { type NextRequest, NextResponse } from "next/server";

// DELETE /api/keys/[id] - delete key by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("keys").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Key deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// GET /api/keys/[id] - get key by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("keys")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch key" }, { status: 500 });
  }
}

// PATCH /api/keys/[id] - update key by id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("keys")
      .update(body)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update key" },
      { status: 500 }
    );
  }
}
