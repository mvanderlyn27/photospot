// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { deletePhotolistLinks, deletePhotolistPhotospotsLinks } from "../helpers/photolistHelpers";

// export const dynamic = 'force-dynamic'

// export async function POST(request: NextResponse) {
//     console.log('deleting');
//     const cookieStore = cookies()
//     const body = await request.json();
//     console.log("body", body);
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
//     const {error} = await supabase.from('photolists').delete().eq('id',body.id);
//     if(error){
//         console.log('error', error);
//         return NextResponse.json({error: error},{status: 500});
//     }
//     const error2 = await deletePhotolistLinks(body.id, supabase);
//     if (error2){
//         console.log('error', error2);
//         return NextResponse.json(error2,{status: 500});
//     }
//     return NextResponse.json({status: 200})
// }

