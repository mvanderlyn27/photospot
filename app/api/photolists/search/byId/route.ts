// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic'

// //works, but could be improved to include fuzzy searching, and similar sounding search
// // links on how to do so
// // https://www.postgresql.org/docs/9.1/fuzzystrmatch.html
// // https://supabase.com/docs/guides/database/full-text-search
// export async function POST(request: NextResponse) {
//     const cookieStore = cookies()
//     const body = await request.json();
//     const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//     const {data, error} = await supabase.from('photolists').select("*").eq('id',body.id); //defaults to websearch and english
//     if(error){
//         console.log('error', error);
//         return NextResponse.json({error: error},{status: 500});
//     }
//     console.log('search: ', body.name, 'res: ', data);
//     return NextResponse.json(data,{status: 200})
// }

