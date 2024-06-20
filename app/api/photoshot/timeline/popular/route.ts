"use server"

import { createClient } from "@/utils/supabase/server"
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    //add in option to select range of time, rn just sort by time in desc
    //gets most popular of all time, not specified to today
    const searchParams = request.nextUrl.searchParams 
    const supabase = createClient()
    const { data: photoshots, error: photoshotError } = await supabase.rpc("get_photoshots_with_highest_likes", { limit_count : 20 });
    if (photoshotError) {
        return new Response(JSON.stringify(photoshotError), { status: 500 })
    }
    console.log('photoshots', photoshots);
    return new Response(JSON.stringify(photoshots), { status: 200 })
}