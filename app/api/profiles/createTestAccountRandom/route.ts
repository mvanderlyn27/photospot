import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
const bucket = "profile_pictures";
//create test account with auth signup, and public profile account too 
//check to see if user role is admin
export async function POST(request: NextResponse) {
    //upload user image too, figure out shape of preferences section
    console.log('creating');
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    //we really want to have create/update/delete to control this
    // const { error } = await supabase.rpc('create_test_user', {email: body.email, password: body.password, metadata: {"username" : body.username }});
    const { data, error } = await supabase.rpc('get_random_user');
    if(error){
        console.log('error', error);
        return NextResponse.json(error,{status: 500});
    }    
    console.log('resp',data);
    //need to do this as an edge function with the auth.admin functions
    //this is broken now
    //changes user session
    // const { data, error } = await supabase.auth.signUp({
    //     email:body.email,
    //     password: body.password,
    //     options: {
    //         data: {
    //             username: body.username
    //         }
    //     }
    // });
    // if(error){
    //     console.log('error', error);
    //     return NextResponse.json(error,{status: 500});
    // }
    // console.log('data', data);
    // const { error: storagePicError } = await supabase.storage.from(bucket).copy('default.jpg', data );
    // if(storagePicError){
    //     console.log('storage error', storagePicError);
    //     return NextResponse.json(storagePicError,{status: 500});
    // }
    //update storage to have default avatar
    return NextResponse.json(data,{status: 200})
}


