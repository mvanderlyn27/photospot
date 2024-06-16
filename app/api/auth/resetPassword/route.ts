"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const password = body.password;
  if (!password) {
    return new Response("Missing password", { status: 400 });
  }
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response("success", { status: 200 });
}
