import { Photospot } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { updatePhotolistsPhotospots } from "../helpers/photolistHelpers";
export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    const cookieStore = cookies()
    const body = await request.json();
    console.log("body", body);
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    //we really want to have create/update/delete to control this
    const {data, error} = await supabase.from('photolists').update(body.photolist).eq('id',body.id).select('*');
    if(error){
        console.log('error', error);
        return NextResponse.json(error,{status: 500});
    }
    if(body.photospots)
    {
        console.log('test for update');
        const error = await updatePhotolistsPhotospots(body.id, body.photospots, supabase); 
        if(error){
            console.log('error', error);
            return NextResponse.json(error,{status: 500});
        }
    }
    return NextResponse.json(data[0], {status: 200})
}



