import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
const bucket = "profile_pictures"

export async function POST(request: NextResponse) {
    const formData = await request.formData();
    const user_id = formData.get('id')?.toString();
    const photo = formData.get("profile_picture");
    const profile_info_raw = formData.get('profile_info');
    //need to modify to update private info too
    if(user_id != null && (photo || profile_info_raw)) {
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
        let profile_data = {}
        if(photo!= null){
            const { error: storageError }= await supabase.storage.from(bucket).upload(String(user_id), photo, {upsert: true});
            if(storageError) {
                if((storageError as any).error == 'Duplicate'){
                    console.log("file name already exists",storageError);
                    return NextResponse.json(`Photospot exists, upload your picture as a review here: `, {status: 501})
                }
                console.log("photo upload error: ",storageError);
                return NextResponse.json(`Failed storing photo ${user_id},`+storageError.message, {status: 500})
            } 
        }
        if(profile_info_raw){
            profile_data = JSON.parse(profile_info_raw.toString());
        }
        const {data: profileUpdated, error: updateError} = await supabase.from('photospots').update(profile_data).eq('id', user_id).select('*');    
        if(updateError){
            console.log('error updating', updateError);
            return NextResponse.json(updateError,{status: 500});
        }
        return NextResponse.json(profileUpdated[0], {status: 200})
    }
    console.log('Missing required info for update', 'id: ',user_id, 'photos: ',photo, 'update info: ',profile_info_raw)
    return NextResponse.json('missing required field for update',{status: 500});
    }


