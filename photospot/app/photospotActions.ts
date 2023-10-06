"use server"
import { z } from 'zod'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function uploadPhotoSpot(prevState: any, formData: FormData) {

    const supabase = createRouteHandlerClient({ cookies })
    const schema = z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        photospot_picture: z.custom<File>()
    })
    const input = schema.parse({
        name: formData.get("name"),
        description: formData.get("description"),
        photospot_picture: formData.get("photospot_picture")

    });
    const bucket = "photospot_pictures"
    const {data, error}= await supabase.storage
      .from(bucket)
      .upload(input.name, input.photospot_picture);

    if(error) {
        if((error as any).error == 'Duplicate'){
            console.log("file name already exists",error);
            //TODO: grab photospot link and add below
            return { message: `Photospot exists, upload your picture as a review here: `}
        }
        console.log("photo upload error: ",error);
        return { message: `Failed storing photo ${input.name},`+error.message }
    } 
    const resp = await supabase
      .from('photospots')
      .insert([{
            name: input.name,
            description: input.description,
            photo_path: [input.name]
        }]);

    if(resp.error){
        console.log("insert error: ",resp.error);
        return { message: `Failed saving data ${input.name},`+resp.error }
    }
 

    //if no error upload photospot data to row, and link picture to new row entry 
    
    return { message: `Uploaded picture ${input.name}` }
}

export async function deletePhotoSpot(prevState: any, formData: FormData){

}
export async function listPhotoSpots(){
    const supabase = createRouteHandlerClient({ cookies });
    const bucket = "photospot_pictures";
    const resp = await supabase.from ('photospots').select('*');
    if(resp.error){
        console.log(resp.error);
        return {data: null, error: resp.error}
    } 
    //todo add photospot type
    let photospot_list: object[] = [];
        resp.data.forEach((photospot: any) => {
        const url = supabase.storage.from(bucket).getPublicUrl(photospot.photo_path)
        console.log('url',url);
        photospot_list.push({
            ...photospot,
            photo_path: url.data.publicUrl
        })
    });
    return {data: photospot_list, error: null};
} 

