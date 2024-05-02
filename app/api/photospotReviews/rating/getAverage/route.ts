// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export const dynamic = 'force-dynamic'

// export async function POST(request: NextRequest) {
//     const cookieStore = cookies()
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
//     const body = await request.json();
//     if(!body.photospot_id){
//         console.log('error no photospot_id  sent');
//         return NextResponse.json({error: 'No photospot_id  sent'},{status: 500});
//     }
//     console.log('getting all reviews of', body.photospot_id)
//     const {data, error }= await supabase.from('photospot_rating_stats').select('id,rating_average').eq('id', body.photospot_id);
//     if(error){
//         console.log('error', error);
//         return NextResponse.json({error: error},{status: 500});
//     }
//     console.log('res', data);
//     if(data.length <=0){
//         return NextResponse.json({},{status: 200});
//     }
//     return NextResponse.json(data[0], {status: 200});
// }
