"use server";
import { createPhotospotSchema } from "@/components/create-page/left-window";
import { editPhotospotSchema } from "@/components/photospot/editPhotospotDialog";
import { Photospot } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PHOTO_BUCKET = "photospot_pictures";
export default async function editPhotospot(
  photospotId: number,
  photospotInfo: z.infer<typeof editPhotospotSchema>,
  photospotPictures: FormData
): Promise<Photospot> {
  if (!photospotInfo || !photospotId) {
    redirect("/error");
  }
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/error?error=not logged in");
  }

  // need to handle removing old photos here fromt he bucket
  if (
    photospotInfo?.photosToRemove &&
    photospotInfo.photosToRemove.length > 0
  ) {
    let photo_path = photospotInfo.photosToRemove.map(
      (name: string) => photospotId + "/" + name
    );
    console.log("removing", photo_path);
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .remove(photo_path);
    if (error) {
      redirect("/error?error=" + error.message);
    }
  }

  let filePaths: string[] = [];
  const photoData: any[] = photospotPictures.getAll("photospot_pictures");
  if (photoData) {
    const fileUploadPromiseArray = photoData.map((photo) => {
      //maybe have lookup when uploading image to see if it exists already
      let photo_path = photospotId + "/" + photo.name;
      return supabase.storage
        .from(PHOTO_BUCKET)
        .upload(photo_path, photo, { upsert: true });
    });
    await Promise.all(fileUploadPromiseArray).then((results) => {
      results.forEach((result) => {
        if (result.error) {
          redirect("/error?error=" + result.error.message);
        }
        filePaths.push(result.data.path);
      });
    });
    filePaths = filePaths.map(
      (path) =>
        supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
    );
  }
  if (photospotInfo.currentPhotos) {
    console.log("fixing photo path");
    filePaths = filePaths.concat(photospotInfo.currentPhotos);
  }
  console.log(photospotInfo, filePaths);

  const { data: editData, error: uploadError } = await supabase
    .from("photospots")
    .update({
      name: photospotInfo.name,
      description: photospotInfo.description,
      photo_paths: filePaths,
    })
    .eq("id", photospotId)
    .select("*")
    .single();
  if (uploadError) {
    console.log("insert error: ", uploadError);
    redirect("error?error=" + uploadError.message);
    // return { message: `Failed saving data ${formInfo.name},` + resp.error }
  }

  return editData;
}
