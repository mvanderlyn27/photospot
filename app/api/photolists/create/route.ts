import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addPhotolistPhotospotsLinks } from "../helpers/photolistHelpers";
export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    const cookieStore = cookies()
    const body = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    const {data, error} = await supabase.from('photolists').insert(body.photolist).select('*');
    if(error){
        console.log('error', error);
        return NextResponse.json(error,{status: 500});
    }
    if(body.photospots)
    {
        const error = await addPhotolistPhotospotsLinks(data[0].id, body.photospots, supabase);
        if (error){
            console.log('error', error);
            return NextResponse.json(error,{status: 500});
        }
    }
    return NextResponse.json(data[0], {status: 200})
}


