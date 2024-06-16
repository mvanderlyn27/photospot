"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email, password } = body;
  if (!email || !password) {
    return new Response("Missing email or password", { status: 400 });
  }
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response("success", { status: 200 });
}
