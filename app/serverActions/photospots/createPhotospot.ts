// "use server"
// import { createPhotospotSchema } from "@/components/create/left-window";
// import { Photospot } from "@/types/photospotTypes";
// import { Database } from "@/types/supabase";
// import { randomNumber } from "@/utils/common/math";
// // import { createClient } from "@/utils/supabase/client";
// import { createClient } from "@/utils/supabase/server";
// import { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { z } from "zod";

// const PHOTO_BUCKET = "photospot_pictures";
// export default async function createPhotospot(photospotInfo: z.infer<typeof createPhotospotSchema>, selectedLocation: SearchBoxFeatureSuggestion | null, location: { lat: number, lng: number }, photospotPictures: FormData): Promise<Photospot> {
//     if (!photospotInfo || !photospotInfo.photos) {
//         redirect('/error');
//     }
//     const supabase = createClient()
//     const { data } = await supabase.auth.getUser();
//     if (!data.user) {
//         redirect('/error?error=not logged in');
//     }
//     const neighborhood = selectedLocation?.properties.context.neighborhood?.name;
//     const { data: uploadData, error: uploadError } = await supabase
//         .from('photospots')
//         .insert({
//             created_by: data.user.id,
//             name: photospotInfo.name,
//             description: photospotInfo.description,
//             photo_paths: [],
//             location: `POINT(${location.lat} ${location.lng})`,
//             lat: location.lat,
//             lng: location.lng,
//             neighborhood: neighborhood
//         }).select('*');
//     if (uploadError) {
//         console.log("insert error: ", uploadError);
//         redirect('error?error=' + uploadError.message);
//         // return { message: `Failed saving data ${formInfo.name},` + resp.error }
//     }

//     let filePaths: string[] = [];
//     const photoData: any[] = photospotPictures.getAll('photospot_pictures');
//     const fileUploadPromiseArray = photoData.map((photo) => {
//         //maybe have lookup when uploading image to see if it exists already
//         let photo_path = uploadData[0].id + '/' + photo.name;
//         return supabase.storage.from(PHOTO_BUCKET).upload(photo_path, photo, { upsert: true });
//     });
//     await Promise.all(fileUploadPromiseArray).then((results) => {
//         results.forEach((result) => {
//             if (result.error) {
//                 redirect('/error?error=' + result.error.message);
//             }
//             filePaths.push(result.data.path);
//         })
//     });

//     filePaths = filePaths.map((path) => supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl);
//     console.log('filepaths', filePaths);
//     const photo_path_update = { photo_paths: filePaths }
//     const { data: photospotWithPhotoPath, error: updatePhotopathError } = await supabase.from('photospots').update(photo_path_update).eq('id', uploadData[0].id).select('*');
//     if (updatePhotopathError) {
//         console.log("update error: ", updatePhotopathError);
//         redirect('/error?=error updating photospot');
//     }
//     revalidatePath('/')
//     console.log("successfully uploaded", photospotWithPhotoPath);
//     return photospotWithPhotoPath[0];
// }