"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Photospot } from "@/types/photospotTypes";
export async function listAllPhotospots(): Promise<Photospot[]> {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { data, error } = await supabase.from("photospots").select("*");
  if (error) {
    redirect("/error?error=" + error.message);
  }
  //todo add photospot type
  return data;
}
