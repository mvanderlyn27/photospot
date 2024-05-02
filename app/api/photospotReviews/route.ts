// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export const dynamic = 'force-dynamic'
// //select via a user_id
// export async function GET(request: NextRequest) {
//     console.log('getting users responses');
//     const cookieStore = cookies()
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
//     const { data: { user } } = await supabase.auth.getUser();
//     if(!user?.id){
//         console.log('error no user id sent');
//         return NextResponse.json({error: 'No user id sent'},{status: 500});
//     }
//     // console.log('getting all reviews of', user.id)
//     const res = await supabase.from('photospot_reviews').select('*').eq('created_by', user.id);
//     // console.log('res', res);
//     if(res.error){
//         console.log('error', res.error);
//         return NextResponse.json({error: res.error},{status: 500});
//     }
//     // console.log('users responses: ',res.data);
//     return NextResponse.json(res.data, {status: 200})

// }
