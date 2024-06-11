"use server"
import { uploadPhotoshotSchema } from "@/components/photoshot/photoshotUploadForm";
import { NewPhotospotInfo, Photoshot, Photospot } from "@/types/photospotTypes";
import { sortByOwnershipAndDate } from "@/utils/common/sort";
import { isPhotospot } from "@/utils/common/typeGuard";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";
const PHOTO_BUCKET = "photoshot_pictures";
export async function PUT(request: Request) {
    const formData = await request.formData();
    const dataRaw = formData.get("data")?.toString();
    const photoData = formData.getAll('photos') as File[];
    const selectedLocationRaw = formData.get("selectedLocation")?.toString();
    // console.log('uploading photoshot', photoshots, photospotId, newPhotospotInfo, photoshotInfo);
    if (!dataRaw || !selectedLocationRaw || !photoData) {
        return new Response("Missing data", { status: 400 });
    }
    const photoshotInfo = JSON.parse(dataRaw) as z.infer<typeof uploadPhotoshotSchema>;
    const selectedLocation = JSON.parse(selectedLocationRaw) as Photospot | NewPhotospotInfo;
    console.log('info, location', photoshotInfo, selectedLocation);
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return new Response("not logged in", { status: 401 });
    }
    let photospotId: number | null = null;
    if (isPhotospot(selectedLocation)) {
        photospotId = selectedLocation.id;
    } else {
        //if no photospot id, create new photospot
        // const photospot = await createPhotospot(selectedLocation);
        const { data: photospotData, error: photospotError } = await supabase.rpc("create_photospot_with_lat_lng", {
            location_namein: selectedLocation.location_name,
            addressin: selectedLocation.address,
            neighborhoodin: selectedLocation.neighborhood,
            locationin: `POINT(${selectedLocation.lng} ${selectedLocation.lat})`,
        }).select("*").single()

        if (photospotError) {
            console.log("insert error: ", photospotError);
            return new Response("error creating photospot", { status: 500 });
        }
        photospotId = photospotData.id;
    }
    if (!photospotId) {
        return new Response("error no photospot to link", { status: 500 });
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
        return new Response("error creating photoshot", { status: 500 });
    }
    //find all photos
    let filePaths: string[] = [];
    // const photoData: any[] = photos;
    const fileUploadPromiseArray = photoData.map((photo: File) => {
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
                return new Response("error uploading photos", { status: 500 });
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
        return new Response("error updating photospot after file upload", { status: 500 });
    }

    console.log("successfully uploaded", photoshotWithPhotoPath);
    // const { data, error } = await supabase
    //     .from("photoshots")
    //     .select("*")
    //     .eq("photospot_id", photospotId);
    // if (error) {
    //     console.log("error", error);
    //     return new Response(error.message, { status: 500 });
    // }
    // //move users to front and add owner tag
    // let photoshotAr = data?.map((photoshot: Photoshot) => {
    //     if (photoshot.created_by === user.data.user?.id) {
    //         photoshot.owner = true;
    //     }
    //     return photoshot;
    // });
    // photoshotAr.sort(sortByOwnershipAndDate);
    // console.log("photoshotAr", photoshotAr);
    // return NextResponse.json(photoshotAr);
    return NextResponse.json(photoshotWithPhotoPath);

}
