// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { addPhotolistPhotospotsLinks } from "../helpers/photolistHelpers";
// export const dynamic = 'force-dynamic'
// const bucket = "photolist_pictures"

// export async function POST(request: NextResponse) {
//     const cookieStore = cookies()
//     const formData = await request.formData();
//     const photos = formData.get("photolist_pictures");
//     const photolist_info_raw = formData.get('photolist_info')?.toString();
//     const photospots_raw = formData.get('photospot_info')?.toString();
//     if(photos!==null && photolist_info_raw){
//         const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//         const photolist_data = JSON.parse(photolist_info_raw);
//         console.log('data to create',photolist_data);
//         const {data: dbData, error: dbError} = await supabase.from('photolists').insert(photolist_data).select('*');
//         console.log('db data: ',dbData);
//         if(dbError || dbData.length <=0){
//             console.log('error creating', dbError);
//             return NextResponse.json(dbError,{status: 500});
//         }
//         const { error: storageError }= await supabase.storage.from(bucket).upload(String(dbData[0].id), photos, );
//         if(storageError) {
//             if((storageError as any).error == 'Duplicate'){
//                 console.log("file name already exists",storageError);
//                 return { message: `photolist exists, upload your picture as a review here: `}
//             }
//             console.log("photo upload error: ",storageError);
//             return { message: `Failed storing photo`+storageError.message }
//         }
//         const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(String(dbData[0].id));
//         const photo_path_data = {photo_paths: [publicUrlData.publicUrl]}
//         const {data: photolistWithPhotoPath, error: updateError} = await supabase.from('photolists').update(photo_path_data).eq('id', dbData[0].id).select('*');
//         if(updateError){
//             console.log('error updating', updateError);
//             return NextResponse.json(updateError,{status: 500});
//         }
//     if(photospots_raw)
//     {
//         const photospot_ar = JSON.parse(photospots_raw);
//         console.log('photospot_ar:',photospot_ar);
//         const error = await addPhotolistPhotospotsLinks(dbData[0].id, photospot_ar, supabase);
//         if (error){
//             console.log('error', error);
//             return NextResponse.json(error,{status: 500});
//         }
//     }
//         return NextResponse.json(photolistWithPhotoPath[0], {status: 200})
//     }
//     return NextResponse.json("no name/photo entered",{status: 500});
// }


