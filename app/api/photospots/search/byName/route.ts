import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    console.log('looking for name on backend');
    const cookieStore = cookies()
    const body = await request.json();
    console.log('body', body);
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {data, error} = await supabase.from('photospots').select("*").textSearch('name',body.name); //defaults to websearch and english
    if(error){
        console.log('error', error);
        return NextResponse.json({error: error},{status: 500});
    }
    console.log('return data', data);
    return NextResponse.json(data,{status: 200})
}

