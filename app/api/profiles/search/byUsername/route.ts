import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    const cookieStore = cookies()
    const body = await request.json();
    console.log('searching by username',body);
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    //what to improve this with fuzzy search
    const {data, error} = await supabase.from('profiles').select('*').textSearch('username',body.username);
    if(error){
        console.log('error', error);
        return NextResponse.json({error: error},{status: 500});
    }
    console.log('info,', data)
    return NextResponse.json(data,{status: 200})
}

