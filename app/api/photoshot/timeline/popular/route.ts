"use server"

import { createClient } from "@/utils/supabase/server"
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    //add in option to select range of time, rn just sort by time in desc
    //gets most popular of all time, not specified to today
    console.log('test');
    const searchParams = request.nextUrl.searchParams 
    let pageCountRaw = searchParams.get('pageCount');
    let pageCount = 1;
    if (pageCountRaw) {
        pageCount = parseInt(pageCountRaw);
    }
    const supabase = createClient()
    const { data: photoshots, error: photoshotError } = await supabase.rpc("get_photoshots_with_highest_likes", { page_count : pageCount });
    if (photoshotError) {

        console.log('photoshotsPopularError', photoshotError);
        return new Response(JSON.stringify(photoshotError), { status: 500 })
    }
    console.log('photoshots', photoshots);
    return new Response(JSON.stringify(photoshots), { status: 200 })
}