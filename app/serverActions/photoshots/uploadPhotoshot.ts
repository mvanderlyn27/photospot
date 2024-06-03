"use server";
import { uploadPhotoshotSchema } from "@/components/photoshot/photoshotUploadDialog";
import { createReviewSchema } from "@/components/review/createReviewDialog";
import { Photoshot, Review } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PHOTO_BUCKET = "photoshot_pictures";
export default async function uploadPhotoshot(
  photoshotInfo: z.infer<typeof uploadPhotoshotSchema>,
  photoshots: FormData,
  photospotId: number | null = null,
  newPhotospotInfo: { location_name: string, neighborhood: string, lat: number, lng: number } | null = null
): Promise<Photoshot> {

  // console.log('uploading photoshot', photoshots, photospotId, newPhotospotInfo, photoshotInfo);
  if (!photoshotInfo || !photoshots || (!photospotId && !newPhotospotInfo)) {
    redirect("/error mising info for uploading photoshot");
  }
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    redirect("/error?error=not logged in");
  }
  if (!photospotId && newPhotospotInfo) {
    //move into createPhotospot server function, get result and use that
    const { data: photospotData, error: photospotError } = await supabase.from("photospots").insert({
      location_name: newPhotospotInfo.location_name,
      neighborhood: newPhotospotInfo.neighborhood,
      location: `POINT(${newPhotospotInfo.lat} ${newPhotospotInfo.lng})`,
    }).select("*").single()
    if (photospotError) {
      console.log("insert error: ", photospotError);
      redirect("error?error=" + photospotError.message);
    }
    photospotId = photospotData.id;
  }
  //if no photospod_id, create new photospot 
  // then upload photoshot
  if (!photospotId) {
    redirect('/error no photospot tied to this photoshot');
  }

  const { data: uploadData, error: uploadError } = await supabase
    .from("photoshots")
    .upsert([
      {
        created_by: user.data.user.id,
        photospot_id: photospotId,
        name: photoshotInfo.name,
        recreate_text: photoshotInfo.recreate_text,
        photo_paths: [],
      },
    ])
    .select("*").single();
  if (uploadError) {
    console.log("insert error: ", uploadError);
    redirect("error?error=" + uploadError.message);
    // return { message: `Failed saving data ${formInfo.name},` + resp.error }
  }
  let filePaths: string[] = [];
  const photoData: any[] = photoshots.getAll("photobook_pictures");
  const fileUploadPromiseArray = photoData.map((photo) => {
    //maybe have lookup when uploading image to see if it exists already
    let photo_path =
      "/" + photospotId + "/" + uploadData.id + "/" + photo.name;
    return supabase.storage
      .from(PHOTO_BUCKET)
      .upload(photo_path, photo, { upsert: true });
  });
  await Promise.all(fileUploadPromiseArray).then((results) => {
    results.forEach((result) => {
      if (result.error) {
        console.log("error uploading file")
        redirect("/error?error=" + result.error.message);
      }
      filePaths.push(result.data.path);
    });
  });

  filePaths = filePaths.map(
    (path) =>
      supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
  );
  console.log("filepaths", filePaths);
  const photo_path_update = { photo_paths: filePaths };
  const { data: photoshotWithPhotoPath, error: updatePhotopathError } =
    await supabase
      .from("photoshots")
      .update(photo_path_update)
      .eq("id", uploadData.id)
      .select("*")
      .single();
  if (updatePhotopathError) {
    console.log("update error: ", updatePhotopathError);
    redirect("/error?=error updating review");
  }
  revalidatePath("/");
  console.log("successfully uploaded", photoshotWithPhotoPath);
  return photoshotWithPhotoPath;
}
