// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export const dynamic = 'force-dynamic'
// const bucket = "review_pictures"
// export async function POST(request: NextRequest) {
//     console.log('deleting review');
//     //need to modify to remove the entry in the db too
//     const cookieStore = cookies()
//     const body = await request.json();
//     console.log("body", body);
//     const photolist_id = body.photolist_id;
//     const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) {
//         return NextResponse.json(`no user data`, { status: 500 })
//     }
//     const photo_path = `photolists/${photolist_id}/${user.id}`;
//     const { error: storageError } = await supabase.storage.from(bucket).remove([photo_path]);
//     if (storageError) {
//         console.log("photo upload error: ", storageError);
//         return NextResponse.json(`Failed deleting stored photos ${photolist_id},` + storageError.message, { status: 500 })
//     }
//     const { error: databaseError } = await supabase.from('photolist_reviews').delete().eq('photolist_id', photolist_id).eq('created_by', user.id);
//     if (databaseError) {
//         console.log('error', databaseError);
//         return NextResponse.json({ error: databaseError }, { status: 500 });
//     }
//     return NextResponse.json({ status: 200 })
// }
