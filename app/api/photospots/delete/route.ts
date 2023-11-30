import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
const bucket = "photospot_pictures"

export async function POST(request: NextResponse) {
    console.log('deleting');
    //need to modify to remove the entry in the db too
    const cookieStore = cookies()
    const body = await request.json();
    const photospot_id = String(body.id);
    console.log("body", body);
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { error: storageError }= await supabase.storage.from(bucket).remove([photospot_id]);
    if(storageError) {
        console.log("photo upload error: ",storageError);
        return NextResponse.json(`Failed deleting stored photos ${photospot_id},`+storageError.message, {status: 500})
    }
    const {error: databaseError} = await supabase.from('photospots').delete().eq('id',photospot_id);    
    if(databaseError){
        console.log('error', databaseError);
        return NextResponse.json({error: databaseError},{status: 500});
    }
    return NextResponse.json({status: 200})
}

