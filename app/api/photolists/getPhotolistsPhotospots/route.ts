import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    console.log('creating');
    const cookieStore = cookies()
    const body = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });
    //eventually move into helper function for bridge functions
    const {data, error} = await supabase.from('photolist_photospots').select('photospot').eq('photolist', body.id);
    if(error){
        console.log('error: ',error);
        return NextResponse.json(error, {status: 500})
    }
    let photospots = data.map(row=>{return row.photospot});
    return NextResponse.json(photospots, {status: 200})
}
