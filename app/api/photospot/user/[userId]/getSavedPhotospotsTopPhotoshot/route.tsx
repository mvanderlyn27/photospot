"use server";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  //create rpc function to get saved photospots, then return them with their top liked photoshots photo info
  const supabase = createClient();
  //   const { data: savedPhotospots, error: savedPhotospotError } =
  // await supabase.rpc("getSavedPhotoshotsWithTopPhoto");
  return null;
}
//look at nearby photospots for example
