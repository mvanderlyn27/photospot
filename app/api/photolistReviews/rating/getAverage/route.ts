import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const body = await request.json();
    if(!body.photolist_id){
        console.log('error no photolist_id  sent');
        return NextResponse.json({error: 'No photolist_id  sent'},{status: 500});
    }
    console.log('getting average for: ', body.photolist_id)
    const {data, error }= await supabase.from('photolist_rating_stats').select('photolist_id,rating_average').eq('photolist_id', body.photolist_id);
    if(error){
        console.log('error', error);
        return NextResponse.json({error: error},{status: 500});
    }
    console.log('res', data);
    if(data.length <=0){
        return NextResponse.json({},{status: 200});
    }
    return NextResponse.json(data[0], {status: 200});
}
