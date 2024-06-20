"use server"

import { createClient } from "@/utils/supabase/server"
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams 
    console.log('searchParams', searchParams);
    const lng= searchParams.get('lng')
    const lat= searchParams.get('lat')
    if (!lat || !lng) {
        console.log("missing body info");
        return new Response(JSON.stringify({ error: 'missing location info' }), { status: 400 })
    }
    const supabase = createClient()
    const { data: photoshots, error: photoshotError } = await supabase.rpc('nearby_photoshots', { latt: parseFloat(lat), long: parseFloat(lng), limit_count : 20 });
    if (photoshotError) {
        return new Response(JSON.stringify(photoshotError), { status: 500 })
    }
    console.log('photoshots', photoshots);
    return new Response(JSON.stringify(photoshots), { status: 200 })
}