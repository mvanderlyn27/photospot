"use server"
import { createPhotospotSchema } from "@/components/create/left-window";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function createPhotospot(formInfo: z.infer<typeof createPhotospotSchema>, location: { lat: number, lng: number }) {


    const supabase = createClient()
    // const schema = z.object({
    //     name: z.string().min(1),
    //     description: z.string().min(1),
    //     photospot_picture: z.custom<File>(),
    //     lat: z.number().gte(-90).and(z.number().lte(90)),
    //     lng: z.number().gte(-180).and(z.number().lte(180))
    // })
    // const input = schema.parse({
    //     name: formInfo.name,
    //     description: formInfo.description,
    //     photospot_picture: formInfo.photos,
    //     lat: location.lat,
    //     lng: location.lng
    // });
    //need to upload multiple
    console.log(formInfo)

    const bucket = "photospot_pictures"
    if (formInfo.photos) {
        //doesn't work lmao, modify to either upload multiple files from filelist, or be passed in one File body
        const photo = formInfo.photos.item(0)
        if (photo) {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(formInfo.name, photo);
            if (error) {
                if ((error as any).error == 'Duplicate') {
                    console.log("file name already exists", error);
                    //TODO: grab photospot link and add below
                    return { message: `Photospot exists, upload your picture as a review here: ` }
                }
                console.log("photo upload error: ", error);
                return { message: `Failed storing photo ${formInfo.name},` + error.message }
            }
        }
    } else {
        redirect('/error');
    }

    const resp = await supabase
        .from('photospots')
        .insert([{
            name: formInfo.name,
            description: formInfo.description,
            photo_paths: [formInfo.name],
            location: `POINT(${location.lat},${location.lng}`
        }]);

    if (resp.error) {
        redirect('error?error=' + resp.error.message);
        // console.log("insert error: ", resp.error);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }
    revalidatePath('/')

    //if no error upload photospot data to row, and link picture to new row entry 

    // return { message: `Uploaded picture ${input.name}` }
}