import { Photospot } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { updatePhotolistsPhotospots } from "../helpers/photolistHelpers";
export const dynamic = "force-dynamic";
const bucket = "photolist_pictures";

export async function POST(request: NextResponse) {
  const formData = await request.formData();
  const photolist_id = formData.get("id")?.toString();
  const photos = formData.get("photolist_pictures");
  const photolist_info_raw = formData.get("photolist_info");
  const photospots_raw = formData.get("photospot_info")?.toString();
  //maybe just have a general check if we have id, and at least one thing to update here
    if (photolist_id != null && (photos || photolist_info_raw)) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    //ADD IN A CHECK TO SEE IF you're the creator of the photolist, otherwise you won't be able to update
    const {data:{user}} = await supabase.auth.getUser();
    if(!user?.id){
        console.log('cant get user');
         return NextResponse.json({status: 500});
    }
    const {data , error } = await supabase.from('photolists').select('id,created_by').eq('id', photolist_id).eq('created_by',user.id);
    if(!data || data.length <= 0 || error){
        console.log('failed ownership check');
         return NextResponse.json(
            `trying to updated a photolist you don't own`,
            { status: 500 }
          ); 
    }
    let photolist_data: any = { edited: true };
    let public_url = undefined;
    if (photos != null) {
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .upload(String(photolist_id), photos, { upsert: true });
      if (storageError) {
        if ((storageError as any).error == "Duplicate") {
          console.log("file name already exists", storageError);
          return NextResponse.json(
            `Photospot exists, upload your picture as a review here: `,
            { status: 501 }
          );
        }
        console.log("photo upload error: ", storageError);
        return NextResponse.json(
          `Failed storing photo ${photolist_id},` + storageError.message,
          { status: 500 }
        );
      }
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(String(photolist_id));
      public_url = publicUrlData.publicUrl;
    }
    if (photolist_info_raw) {
        photolist_data = JSON.parse(photolist_info_raw.toString());
    }
    if (public_url) {
        photolist_data = {
        ...photolist_data,
        photo_paths: [public_url + "?t=" + formData.get("update_time")],
      };
    }
    console.log("updated path: ", photolist_data);
    const { data: photolistWithPhotoPath, error: updateError } = await supabase
      .from("photolists")
      .update(photolist_data)
      .eq("id", photolist_id)
      .select();
    if (updateError) {
      console.log("error updating", updateError);
      return NextResponse.json(updateError, { status: 500 });
    }
    if (photospots_raw) {
      const photospot_ar = JSON.parse(photospots_raw);
      console.log("photospot_ar:", photospot_ar);
      const error = await updatePhotolistsPhotospots(
        photolistWithPhotoPath[0].id,
        photospot_ar,
        supabase
      );
      if (error) {
        console.log("error", error);
        return NextResponse.json(error, { status: 500 });
      }
    }
    console.log("update complete", photolistWithPhotoPath);
    return NextResponse.json(photolistWithPhotoPath[0], { status: 200 });
  }
  console.log( "Missing required info for update id: ",
  photolist_id,
    "photos: ",
    photos,
    "update info: ",
    photolist_info_raw
  );
  return NextResponse.json("missing required field for update", {
    status: 500,
  });

  // const cookieStore = cookies()
  // const body = await request.json();
  // console.log("body", body);
  // const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  // //we really want to have create/update/delete to control this
  // const {data, error} = await supabase.from('photolists').update({...body.photolist, updated: true}).eq('id',body.id).select('*');
  // if(error){
  //     console.log('error', error);
  //     return NextResponse.json(error,{status: 500});
  // }
  // if(body.photospots)
  // {
  //     console.log('test for update');
  //     const error = await updatePhotolistsPhotospots(body.id, body.photospots, supabase);
  //     if(error){
  //         console.log('error', error);
  //         return NextResponse.json(error,{status: 500});
  //     }
  // }
  // return NextResponse.json(data[0], {status: 200})
}
