import { Photospot } from "@/types/photospotTypes"
import { Database } from "@/types/supabase"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
const bucket = "profile_pictures";

export async function GET() {
    //maybe only get your profile
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    const { data: { session }, } = await supabase.auth.getSession();
    //need to think through this part more, do we want to control with RLS, or here 
    if(!session?.user.id)
    {
        console.log('error no user logged in');
        return NextResponse.json({error: "need a user logged in to load info"},{status: 500});
    }
    const user_id = session.user.id;
    // const {data: profilePrivateData, error: profilePrivateError} = await supabase.from('profiles_priv').select('*').eq('id', user_id );
    // console.log('res', profilePrivateData);
    // if(profilePrivateError){
    //     console.log('error', profilePrivateError);
    //     return NextResponse.json({error: profilePrivateError},{status: 500});
    // }
    // const {data: profileData, error: profileError} = await supabase.from('profiles').select('username,private').eq('id', user_id);
    // console.log('res', profileData);
    // if(profileError){
    //     console.log('error', profileError);
    //     return NextResponse.json({error: profileError},{status: 500});
    // }
    // return NextResponse.json({...profilePrivateData, ...profileData}, {status: 200})
    const get_private_profile_promise = supabase.from('profiles_priv').select('*').eq('id', user_id );    
    const get_public_profile_promise = supabase.from('profiles').select('username,private').eq('id', user_id);
    const values = await Promise.all([get_private_profile_promise, get_public_profile_promise]);
    let output: any= {};
    values.forEach(out => {
        if(out.error) {
            console.log('error', out.error);
            return NextResponse.json({error: out.error},{status: 500});
        }
        output = {...output, ...out.data[0]};
    });
    const { data: url_data } = supabase.storage.from(bucket).getPublicUrl(output.id)
    output = {...output, profile_pic_url: url_data.publicUrl }
    console.log('out',output);
    return NextResponse.json(output,{status: 200});
}