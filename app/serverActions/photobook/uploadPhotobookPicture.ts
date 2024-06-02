"use server";
import { uploadPhotobookPictureSchema } from "@/components/photoshot/uploadPhotobookPictureDialog";
import { createReviewSchema } from "@/components/review/createReviewDialog";
import { PhotobookPicture, Review } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PHOTO_BUCKET = "photospot_pictures";
export default async function uploadPhotobookPicture(
  photobookPictureInfo: z.infer<typeof uploadPhotobookPictureSchema>,
  photospot_id: number,
  photobookPictures: FormData
): Promise<PhotobookPicture> {
  if (!photobookPictureInfo || !photobookPictureInfo.photos) {
    redirect("/error");
  }
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    redirect("/error?error=not logged in");
  }
  const { data: uploadData, error: uploadError } = await supabase
    .from("photospots_photobook_pictures")
    .upsert([
      {
        created_by: user.data.user.id,
        photospot_id: photospot_id,
        name: photobookPictureInfo.name,
        description: photobookPictureInfo.description,
        photo_paths: [],
      },
    ])
    .select("*");
  if (uploadError) {
    console.log("insert error: ", uploadError);
    redirect("error?error=" + uploadError.message);
    // return { message: `Failed saving data ${formInfo.name},` + resp.error }
  }

  let filePaths: string[] = [];
  const photoData: any[] = photobookPictures.getAll("photobook_pictures");
  const fileUploadPromiseArray = photoData.map((photo) => {
    //maybe have lookup when uploading image to see if it exists already
    let photo_path =
      photospot_id + "/photobook/" + uploadData[0].id + "/" + photo.name;
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
  console.log("filepaths", filePaths);
  const photo_path_update = { photo_paths: filePaths };
  const { data: photobookPictureWithPhotoPath, error: updatePhotopathError } =
    await supabase
      .from("photospots_photobook_pictures")
      .update(photo_path_update)
      .eq("id", uploadData[0].id)
      .select("*")
      .single();
  if (updatePhotopathError) {
    console.log("update error: ", updatePhotopathError);
    redirect("/error?=error updating review");
  }
  revalidatePath("/");
  console.log("successfully uploaded", photobookPictureWithPhotoPath);
  return photobookPictureWithPhotoPath;
}
