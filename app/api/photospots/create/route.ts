import { Photospot } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function POST(request: NextResponse) {
    //handle uploading the picture first, afterwards we can store the rest of the info
    //only handles a single photo per photospot right now
   
    console.log('creating');
    const cookieStore = cookies()
    const body: {photospot: Photospot, photospot_pictures: File[]} = await request.json();
    console.log("body", body);
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    const bucket = "photospot_pictures"
    //only lets you upload one picture
    const { error: storageError }= await supabase.storage.from(bucket).upload(body.photospot.name, body.photospot_pictures[0]);
    if(storageError) {
        if((storageError as any).error == 'Duplicate'){
            console.log("file name already exists",storageError);
            //TODO: grab photospot link and add below
            return { message: `Photospot exists, upload your picture as a review here: `}
        }
        console.log("photo upload error: ",storageError);
        return { message: `Failed storing photo ${body.photospot.name},`+storageError.message }
    } 
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(body.photospot.name);

    //may not work properly here
    body.photospot.photo_paths = [publicUrlData.publicUrl];

    const {data: dbData, error: dbError} = await supabase.from('photospots').insert(body.photospot).select('*');
    if(dbError){
        console.log('error', dbError);
        return NextResponse.json(dbError,{status: 500});
    }

    return NextResponse.json(dbData[0], {status: 200})
}


