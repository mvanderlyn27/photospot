import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    const cookieStore = cookies()
    const body = await request.json();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {data, error} = await supabase.from('photospots').select('*').eq('id',body.id);
    if(error){
        console.log('error', error);
        return NextResponse.json({error: error},{status: 500});
    }
    return NextResponse.json(data,{status: 200})
}

