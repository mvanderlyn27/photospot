import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { sign } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
const bucket = "profile_pictures";

export async function POST(request: NextResponse) {
    //delete user profile image
    const requestUrl = new URL(request.url)
    console.log('deleting logged in profile');
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()   
    if(!user){
        console.log('error cant find user');
        return NextResponse.json({error: new Error('error cant find user')},{status: 500});
    }
    const delete_user_auth_promise = supabase.rpc('delete_current_user ');
    const delete_profile_pic_promise =  supabase.storage.from(bucket).remove([user.id]);
    const values = await Promise.all([delete_user_auth_promise, delete_profile_pic_promise ]);
    values.forEach(out => {
        console.log('response from delete promises', out);
        if(out.error) {
            console.log('error', out.error);
            return NextResponse.json({error: out.error},{status: 500});
        }
    });
    console.log('successful delete');
    const {error: signoutError}=await supabase.auth.signOut();
    if(signoutError) {
        console.log('error', signoutError);
        return NextResponse.json({error: signoutError},{status: 500});
    }
    return NextResponse.redirect(`${requestUrl.origin}/`, {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    })
    
}

