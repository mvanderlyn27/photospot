import { Database } from "@/types/supabase"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';
export const bucket = "profile_pictures";

export async function GET() {
    //maybe only get your profile
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    //not sure if we need some other checks here
    const {data, error} = await supabase.from('profiles').select('*').eq('private', false);
    if(error) {
        console.log('error', error);
        return NextResponse.json({error: error},{status: 500});
    }
    const output = data.map(profile => {
        const { data : url_data} = supabase.storage.from(bucket).getPublicUrl(profile.id)
        return {...profile, profile_pic_url: url_data.publicUrl }
    });
    // console.log('data', output);
    return NextResponse.json(output ,{status: 200});
}