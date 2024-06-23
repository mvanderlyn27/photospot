"use server"

import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
//too slow to use in map selection rn
export async function GET(request: NextRequest) {
        const searchParams = request.nextUrl.searchParams 
    console.log('searchParams', searchParams);
    const lng= searchParams.get('lng')
    const lat= searchParams.get('lat')
    if (!lat || !lng) {
        console.log("missing body info");
        return new Response(JSON.stringify({ error: 'missing location info' }), { status: 400 })
    }
let pageCountRaw = searchParams.get('pageCount');
    let pageCount = 1;
    if (pageCountRaw) {
        pageCount = parseInt(pageCountRaw);
    } 
   const supabase = createClient()
    const { data, error } = await supabase.rpc("nearby_photospots", { latt: parseFloat(lat), long:parseFloat(lng), page_count: pageCount, page_size: 20 }).select("*");
    if (error) {
        console.log(error)
        return new Response(error.message, { status: 500 })
    }
    console.log("nearby photospots", data);
    return NextResponse.json(data);
}