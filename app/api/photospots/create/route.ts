// import { Photospot, PhotospotInput, PhotospotInsert } from "@/types/photospotTypes";
// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// export const dynamic = 'force-dynamic'
// const bucket = "photospot_pictures"
// export async function POST(request: NextRequest) {
//     //handle uploading the picture first, afterwards we can store the rest of the info
//     //only handles a single photo per photospot right now
//     const cookieStore = cookies()
//     const formData = await request.formData();
//     const photos = formData.get("photospot_pictures");
//     const photospot_info_raw = formData.get('photospot_info')?.toString();
//     if(photos!==null && photospot_info_raw){
//         const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//         const photospot_data = JSON.parse(photospot_info_raw);
//         console.log('data to create',photospot_data);
//         const {data: dbData, error: dbError} = await supabase.from('photospots').insert(photospot_data).select('*');
//         console.log('db data: ',dbData);
//         if(dbError || dbData.length <=0){
//             console.log('error creating', dbError);
//             return NextResponse.json(dbError,{status: 500});
//         }
//         const { error: storageError }= await supabase.storage.from(bucket).upload(String(dbData[0].id), photos);
//         if(storageError) {
//             if((storageError as any).error == 'Duplicate'){
//                 console.log("file name already exists",storageError);
//                 return { message: `Photospot exists, upload your picture as a review here: `}
//             }
//             console.log("photo upload error: ",storageError);
//             return { message: `Failed storing photo ${name},`+storageError.message }
//         }
//         const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(String(dbData[0].id));
//         const photo_path_data = {photo_paths: [publicUrlData.publicUrl]}
//         const {data: photospotWithPhotoPath, error: updateError} = await supabase.from('photospots').update(photo_path_data).eq('id', dbData[0].id).select('*');
//         if(updateError){
//             console.log('error updating', updateError);
//             return NextResponse.json(updateError,{status: 500});
//         }
//         return NextResponse.json(photospotWithPhotoPath[0], {status: 200})
//     }
//     return NextResponse.json("no name/photo entered",{status: 500});
// }
