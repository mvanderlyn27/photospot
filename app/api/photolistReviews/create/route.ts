// import { Database } from "@/types/supabase";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// export const dynamic = 'force-dynamic'
// const bucket = "review_pictures"

// export async function POST(request: NextRequest) {
//     console.log('creating');
//     const cookieStore = cookies()
//     const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
//     const formData = await request.formData();
//     console.log("body", formData);
//     const raw_review_data = formData.get('review_info');
//     const photos = formData.get('photos');
//     if (raw_review_data !== null) {
//         const review_info = JSON.parse(raw_review_data.toString());
//         console.log('review_info', review_info);
//         const { data, error } = await supabase.from('photolist_reviews').insert(review_info).select('*');
//         if (error) {
//             console.log('error', error);
//             return NextResponse.json(error, { status: 500 });
//         }
//         if (photos !== null) {
//             const photo_path = `photolists/${review_info.photospot_id}/${data[0].created_by}?t=${formData.get('timestamp')}`;
//             const { error: storageError } = await supabase.storage.from(bucket).upload('/' + photo_path, photos, { upsert: true });
//             if (storageError) {
//                 console.log("photo upload error: ", storageError);
//                 return NextResponse.json({ message: `Failed storing photo ${photo_path},` + storageError.message }, { status: 500 });
//             }
//             const photo_path_url = supabase.storage.from(bucket).getPublicUrl(photo_path).data.publicUrl;
//             const photo_path_data = { photo_paths: [photo_path_url] };
//             const { data: updatedPhotoPathData, error: updatedPhotoPathError } = await supabase.from('photolist_reviews').update(photo_path_data).eq('created_by', review_info.created_by).eq('photolist_id', review_info.photolist_id).select('*');
//             if (updatedPhotoPathError) {
//                 console.log('error', updatedPhotoPathError);
//                 return NextResponse.json(updatedPhotoPathError, { status: 500 });
//             }
//             return NextResponse.json(updatedPhotoPathData[0], { status: 200 })
//         }

//         return NextResponse.json(data[0], { status: 200 })
//     }
//     return NextResponse.json('no info sent to create review with', { status: 500 });

// }


