"use server";
import { Photoshot, Tag } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const PHOTO_BUCKET = "photoshot_pictures";
export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  const formData = await request.formData();
  const data = JSON.parse(formData.get("data")?.toString() || "{}");
  const photos = formData.getAll("photos") as File[];
  if (!data || !photos) {
    return new Response("Missing data", { status: 400 });
  }
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("user not logged in", { status: 401 });
  }
  const { data: photoshot, error: photoshotError } = await supabase
    .from("photoshots")
    .select("*")
    .eq("id", params.id)
    .single();
  if (photoshotError || !photoshot) {
    console.log("photoshot error", photoshotError);
    return new Response("issue getting photoshot", { status: 500 });
  }
  const photospotId = photoshot.photospot_id;
  const photoshotId = photoshot.id;
  // need to handle removing old photos here fromt he bucket
  console.log(data);
  if (data?.photosToRemove && data.photosToRemove.length > 0) {
    let photo_path = data.photosToRemove.map(
      (name: string) => "/" + photospotId + "/" + photoshotId + "/" + name
    );
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .remove(photo_path);
    if (error) {
      console.log("error removing photo", error.message);
      return new Response("Issue removing photo", { status: 500 });
    }
  }

  let filePaths: string[] = [];
  if (photos) {
    const fileUploadPromiseArray = photos.map((photo) => {
      //maybe have lookup when uploading image to see if it exists already
      let photo_path = "/" + photospotId + "/" + photoshotId + "/" + photo.name;
      return supabase.storage
        .from(PHOTO_BUCKET)
        .upload(photo_path, photo, { upsert: true });
    });
    await Promise.all(fileUploadPromiseArray).then((results) => {
      results.forEach((result) => {
        if (result.error) {
          console.log("error uploading file", result.error.message);
          return new Response("issue updloading files", { status: 500 });
        }
        filePaths.push(result.data.path);
      });
    });
    filePaths = filePaths.map(
      (path) =>
        supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
    );
  }

  const photosToKeep = photoshot.photo_paths.filter(
    (p) => !data.photosToRemove.includes(p)
  );
  filePaths = filePaths.concat(photosToKeep);

  const { data: uploadData, error: uploadError } = await supabase
    .from("photoshots")
    .update({
      name: data.name,
      recreate_text: data.recreate_text,
      photo_paths: filePaths,
    })
    .eq("id", photoshotId)
    .select("*, ...profiles!photoshots_created_by_fkey(username)")
    .single();
  if (uploadError) {
    console.log("insert error: ", uploadError);
    return new Response("Failed saving data", { status: 500 });
    // return { message: `Failed saving data ${formInfo.name},` + resp.error }
  }
  let uploadDataWithTag: Photoshot = uploadData;
  //need to remove all old tags, and add new ones properly
  console.log("tags", data.tags);
  if (data.tags?.length >= 0) {
    const tagIds = data.tags.map((tag: Tag) => tag.id);
    const { error: tagError } = await supabase.rpc("update_photoshot_tags", {
      tag_ids: tagIds,
      photoshot_id: photoshotId,
    });
    if (tagError) {
      console.log("error removing tags", tagError);
      return new Response("error removing tags", { status: 500 });
    }
    const { data: tagData, error: tagDataError } = await supabase
      .from("tags")
      .select("*")
      .in("id", tagIds);
    if (tagDataError) {
      console.log("error getting tags", tagDataError);
      return new Response("error getting tags", { status: 500 });
    }
    uploadDataWithTag = {
      ...uploadDataWithTag,
      owner: true,
      tags: tagData.map((tag: Tag) => {
        return { id: tag.id, name: tag.name };
      }),
    };
  }
  console.log("successfully edited", uploadDataWithTag);
  return NextResponse.json(uploadDataWithTag);
}
