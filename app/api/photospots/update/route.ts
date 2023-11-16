import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    console.log('creating');
    const cookieStore = cookies()
    const body = await request.json();
    console.log("body", body);
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    //we really want to have create/update/delete to control this
    const {data, error} = await supabase.from('photospots').update(body.photospot).eq('id',body.id).select('*');
    if(error){
        console.log('error', error);
        return NextResponse.json(error,{status: 500});
    }

    return NextResponse.json(data[0], {status: 200})
}



