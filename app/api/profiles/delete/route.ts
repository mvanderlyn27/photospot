import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { sign } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
const bucket = "profile_pictures";

export async function POST(request: NextResponse) {
    //delete user profile image
    console.log('deleting');
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()   
    if(!user){
        console.log('error cant find user');
        return NextResponse.json({error: new Error('error cant find user')},{status: 500});
    }
    const delete_user_auth_promise = supabase.rpc('delete_current_user');
    const delete_profile_pic_promise =  supabase.storage.from(bucket).remove([user.id]);
    const delete_public_profile_promise = supabase.from('profiles').delete().eq('id',user.id);    
    const signout_promise = supabase.auth.signOut();
    const values = await Promise.all([delete_user_auth_promise, delete_profile_pic_promise, delete_public_profile_promise, signout_promise ]);
    values.forEach(out => {
        if(out.error) {
            console.log('error', out.error);
            return NextResponse.json({error: out.error},{status: 500});
        }
    });
    return NextResponse.json({status: 200})

    // const { error: deleteError} = await supabase.rpc('delete_current_user');
    // if(deleteError){
    //     console.log('error deleting auth', deleteError);
    //     return NextResponse.json({error: deleteError},{status: 500});
    // }
    // //can turn this into a db trigger
    // const { error : storageError} = await supabase.storage.from(bucket).remove([user.id]);
    // if(storageError){
    //     console.log('error removing profile pic', storageError);
    //     return NextResponse.json({error: storageError},{status: 500});
    // }
    // const {error} = await supabase.from('profiles').delete().eq('id',body.id);    
    // if(error){
    //     console.log('error removing profile', error);
    //     return NextResponse.json({error: error},{status: 500});
    // }
    // const { error: signoutError} = await supabase.auth.signOut();
    // if(signoutError){
    //     console.log('error error signing out', signoutError);
    //     return NextResponse.json({error: signoutError},{status: 500});
    // }
//     return NextResponse.json({status: 200})
}

