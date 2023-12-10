import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
//get all reviews of a photospot
export async function POST(request: NextRequest) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const body = await request.json();
    if(!body.photospot_id){
        console.log('error no photospot id sent');
        return NextResponse.json({error: 'No photospot id sent'},{status: 500});
    }
    console.log('getting all reviews of', body.photospot_id)
    const res = await supabase.from('photospot_reviews').select('*').eq('photospot_id', body.photospot_id);
    console.log('res', res);
    if(res.error){
        console.log('error', res.error);
        return NextResponse.json({error: res.error},{status: 500});
    }
    return NextResponse.json(res.data, {status: 200})

}