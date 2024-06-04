"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Photospot } from "@/types/photospotTypes";
export async function listAllPhotospots(): Promise<Photospot[]> {
  const supabase = createClient();

  // UPDATE TO GET A PHOTOSPOTS MOST POPULAR PHOTO
  const { data, error } = await supabase.rpc("get_all_photospots_with_lat_lng").select("*");
  if (error) {
    redirect("/error?error=" + error.message);
  }
  //todo add photospot type
  return data;
}
