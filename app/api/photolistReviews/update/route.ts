import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
const bucket = "review_pictures"
export async function POST(request: NextResponse) {
    console.log('updating review');
    const formData = await request.formData();
    const photolist_id= formData.get('photolist_id')?.toString();
    const photos = formData.get("review_pictures");
    const review_info_raw = formData.get('review_info');
    //maybe just have a general check if we have id, and at least one thing to update here
    if(photolist_id != null && (photos || review_info_raw)) {
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
        const {data: {user}} = await supabase.auth.getUser();
        if(!user?.id ){
            return NextResponse.json(`issue getting user session`, {status: 500})
        }
        let review_data: any= {edited: true}
        let public_url = undefined; 
        if(photos!= null){
            const photo_path = `photolists/${photolist_id}/${user.id}`;
            const { error: storageError }= await supabase.storage.from(bucket).upload('/'+photo_path, photos, {upsert: true});
            if(storageError) {
                console.log("photo upload error: ",storageError);
                return NextResponse.json(`Failed storing photo ${photolist_id},`+storageError.message, {status: 500})
            } 
            const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(photo_path);
            public_url = publicUrlData.publicUrl;
        }
        if(review_info_raw){
            review_data = JSON.parse(review_info_raw.toString());
        }
        if(public_url){
            review_data = {...review_data, photo_paths: [public_url+"?t="+formData.get('timestamp')]};
        }
        console.log('updated path: ',review_data);
        const {data: reviewWithPhotoPath, error: updateError} = await supabase.from('photolist_reviews').update(review_data).eq('created_by', user.id).eq('photolist_id',photolist_id).select('*');    
        if(updateError){
            console.log('error updating', updateError);
            return NextResponse.json(updateError,{status: 500});
        }
        console.log('update complete', reviewWithPhotoPath);
        return NextResponse.json(reviewWithPhotoPath[0], {status: 200})
    }
    console.log('Missing required info for update', 'id: ',photolist_id, 'photos: ',photos, 'update info: ',review_info_raw)
    return NextResponse.json('missing required field for update',{status: 500});
}



