"use server";
import { NewPhotospotInfo, Photoshot, Photospot, Review } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import createPhotospot from "../photospots/createPhotospot";
import { isPhotospot } from "@/utils/common/typeGuard";

const PHOTO_BUCKET = "photoshot_pictures";
export default async function uploadPhotoshot(
  photoshotInfo: any,
  photoshots: FormData,
  selectedLocation: Photospot | NewPhotospotInfo
): Promise<Photoshot> {

  // console.log('uploading photoshot', photoshots, photospotId, newPhotospotInfo, photoshotInfo);
  if (!photoshotInfo || !photoshots || !selectedLocation) {
    redirect("/error mising info for uploading photoshot");
  }
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    redirect("/error?error=not logged in");
  }
  let photospotId: number | null = null;
  if (isPhotospot(selectedLocation)) {
    photospotId = selectedLocation.id;
  } else {
    //if no photospot id, create new photospot
    const photospot = await createPhotospot(selectedLocation);
    photospotId = photospot.id;
  }
  if (!photospotId) {
    redirect("/error?error=missing photospot id");
  }
  // insert photoshot info
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
  }
  //find all photos
  let filePaths: string[] = [];
  const photoData: any[] = photoshots.getAll("photoshot_pictures");
  const fileUploadPromiseArray = photoData.map((photo) => {
    //maybe have lookup when uploading image to see if it exists already
    let photo_path = "/" + photospotId + "/" + uploadData.id + "/" + photo.name;
    return supabase.storage
      .from(PHOTO_BUCKET)
      .upload(photo_path, photo, { upsert: true });
  });
  //upload all photos
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
