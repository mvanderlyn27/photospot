// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic'

// export async function POST(request: NextResponse) {
//     const cookieStore = cookies()
//     const body = await request.json();
//     console.log('body',body);
//     const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//     //get photospots in a range of creation time, then sort
//     const {data, error} = await supabase.from('photolists').select("*").gte('created_at', body.start).lte('created_at',body.end).order('created_at', {ascending: body.ascending});
//     if(error){
//         console.log('error', error);
//         return NextResponse.json({error: error},{status: 500});
//     }
//     console.log('data',data);
//     return NextResponse.json(data,{status: 200})
// }

