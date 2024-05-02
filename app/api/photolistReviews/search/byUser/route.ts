// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export const dynamic = 'force-dynamic'
// //select via a user_id
// export async function POST(request: NextRequest) {
//     const cookieStore = cookies()
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
//     const body = await request.json();
//     if(!body.user_id){
//         console.log('error no user id sent');
//         return NextResponse.json({error: 'No user id sent'},{status: 500});
//     }
//     console.log('getting all reviews of', body.user_id)
//     const res = await supabase.from('photolist_reviews').select('*').eq('created_by', body.user_id);
//     console.log('res', res);
//     if(res.error){
//         console.log('error', res.error);
//         return NextResponse.json({error: res.error},{status: 500});
//     }
//     return NextResponse.json(res.data, {status: 200})

// }
