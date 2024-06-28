"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email, password } = body;
  if (!email || !password) {
    return new Response(JSON.stringify("Missing email or password"), { status: 400 });
  }
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    console.log('error logging in');
    return new Response(JSON.stringify(error.message), { status: 400 });
  }

  return new Response(JSON.stringify("success"), { status: 200 });
}
