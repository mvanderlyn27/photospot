import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
const bucket = "review_pictures"
export async function POST(request: NextResponse) {
    console.log('deleting');
    //need to modify to remove the entry in the db too
    const cookieStore = cookies()
    const body = await request.json();
    console.log("body", body);
    const photospot_id = String(body.photospot_id);
    const user_id = String(body.user_id);
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const photo_path = `/photospots/${photospot_id}/${user_id}`;
    const { error: storageError }= await supabase.storage.from(bucket).remove([photo_path]);
    if(storageError) {
        console.log("photo upload error: ",storageError);
        return NextResponse.json(`Failed deleting stored photos ${photospot_id},`+storageError.message, {status: 500})
    }
    const {error: databaseError} = await supabase.from('photospot_reviews').delete().eq('photospot_id',photospot_id).eq('created_by',user_id);    
    if(databaseError){
        console.log('error', databaseError);
        return NextResponse.json({error: databaseError},{status: 500});
    }
    return NextResponse.json({status: 200})
}
