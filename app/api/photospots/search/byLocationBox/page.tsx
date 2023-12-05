import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    console.log('looking for name on backend');
    const cookieStore = cookies()
    const body = await request.json();
    console.log('body', body);
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    // const {data, error} = await supabase.rpc("nearby_photospots", { lat: body.lat, long: body.lng, }).lte('distance_meters', body.maxDistance);
    const {data, error} = await supabase.rpc("photospots_in_view", { min_lat: body.min_lat, min_long: body.min_lng, max_lat: body.max_lat, max_long: body.max_lng,}).lte('dist_meters', body.maxDistance);
    if(error){
        console.log('error', error);
        return NextResponse.json({error: error},{status: 500});
    }
    console.log('return data', data);
    return NextResponse.json(data,{status: 200})
}

