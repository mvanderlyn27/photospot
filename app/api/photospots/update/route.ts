import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
const bucket = "photospot_pictures"
export async function POST(request: NextResponse) {
    const formData = await request.formData();
    const photospot_id = formData.get('id')?.toString();
    const photos = formData.get("photospot_pictures");
    const photospot_info_raw = formData.get('photospot_info');
    //maybe just have a general check if we have id, and at least one thing to update here
    if(photospot_id != null && (photos || photospot_info_raw)) {
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
        let photospot_data: any= {edited: true}
        let public_url = undefined; 
        if(photos!= null){
            const { error: storageError }= await supabase.storage.from(bucket).upload(String(photospot_id), photos, {upsert: true});
            if(storageError) {
                if((storageError as any).error == 'Duplicate'){
                    console.log("file name already exists",storageError);
                    return NextResponse.json(`Photospot exists, upload your picture as a review here: `, {status: 501})
                }
                console.log("photo upload error: ",storageError);
                return NextResponse.json(`Failed storing photo ${photospot_id},`+storageError.message, {status: 500})
            } 
            const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(String(photospot_id));
            public_url = publicUrlData.publicUrl;
        }
        if(photospot_info_raw){
            photospot_data = JSON.parse(photospot_info_raw.toString());
        }
        if(public_url){
            photospot_data = {...photospot_data, photo_paths: [public_url+"?t="+formData.get('update_time')]};
        }
        console.log('updated path: ',photospot_data);
        const {data: photospotWithPhotoPath, error: updateError} = await supabase.from('photospots').update(photospot_data).eq('id', photospot_id).select('*');    
        if(updateError){
            console.log('error updating', updateError);
            return NextResponse.json(updateError,{status: 500});
        }
        console.log('update complete', photospotWithPhotoPath);
        return NextResponse.json(photospotWithPhotoPath[0], {status: 200})
    }
    console.log('Missing required info for update', 'id: ',photospot_id, 'photos: ',photos, 'update info: ',photospot_info_raw)
    return NextResponse.json('missing required field for update',{status: 500});
}



