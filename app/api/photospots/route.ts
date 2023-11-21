import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const res = await supabase.from('photospots').select('*');
    // console.log('res', res);
    if(res.error){
        console.log('error', res.error);
        return NextResponse.json({error: res.error},{status: 500});
    }
    return NextResponse.json(res.data, {status: 200})

}