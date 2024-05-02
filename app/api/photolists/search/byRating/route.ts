// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic'
// //sort by avg rating, default to descending
// export async function POST(request: NextResponse) {
//     const cookieStore = cookies()
//     const body = await request.json();
//     console.log('body',body);
//     const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//     //get photospots in a range of creation time, then sort
//     const {data, error} = await supabase.from('photolist_rating_stats').select("*").order('rating_average', {ascending: body.ascending ? body.ascending : false, nullsFirst: false});
//     if(error){
//         console.log('error', error);
//         return NextResponse.json({error: error},{status: 500});
//     }
//     console.log('data',data);
//     return NextResponse.json(data,{status: 200})
// }

