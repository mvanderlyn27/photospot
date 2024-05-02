// import { Photospot } from "@/types/photospotTypes"
// import { Database } from "@/types/supabase"
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
// import { cookies } from "next/headers"
// import { NextRequest, NextResponse } from "next/server"

// export const dynamic = 'force-dynamic'
// const bucket = "profile_pictures";

// export async function GET() {
//     //maybe only get your profile
//     const cookieStore = cookies()
//     const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//     const { data: { session }, } = await supabase.auth.getSession();
//     if(!session?.user.id)
//     {
//         console.log('error no user logged in');
//         return NextResponse.json({error: "need a user logged in to load info"},{status: 500});
//     }
//     const user_id = session.user.id;
//     const get_private_profile_promise = supabase.from('profiles_priv').select('*').eq('id', user_id );
//     const get_public_profile_promise = supabase.from('profiles').select('username,private').eq('id', user_id);
//     const values = await Promise.all([get_private_profile_promise, get_public_profile_promise]);
//     let output: any= {};
//     values.forEach(out => {
//         if(out.error) {
//             console.log('error', out.error);
//             return NextResponse.json({error: out.error},{status: 500});
//         }
//         output = { ...output, ...out.data[0]};
//     });
//     const { data: url_data } = supabase.storage.from(bucket).getPublicUrl(output.id)
//     output = {email: session.user.email, ...output, profile_pic_url: url_data.publicUrl+'?t='+Date.now() }
//     return NextResponse.json(output,{status: 200});
// }