"use client"
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { round } from "@/utils/common/math";
import { Button, buttonVariants } from "../ui/button";
import { redirect, useRouter } from "next/navigation";
import ImageCarousel from "../common/ImageCarousel";
import { DefaultPhotospot } from "@/utils/common/imageLinks";
import RatingDisplay from "../review/ratingDisplay";
import { useEffect, useState } from "react";
import { getPhotospotsPhotoshotTags } from "@/app/serverActions/photospots/getPhotospotsPhotoshotTags";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { cn } from "@/lib/utils";
import { isPhotospot } from "@/utils/common/typeGuard";
import { Skeleton } from "../ui/skeleton";

export default function PhotospotPreview({ selectedLocation, loadingSelectedLocation }: { selectedLocation: Photospot | NewPhotospotInfo | null, loadingSelectedLocation: boolean }) {
    const [tags, setTags] = useState<string[]>([]);
    const [photoshotDialogOpen, setPhotoshotDialogOpen] = useState(false);
    const router = useRouter();
    useEffect(() => {
        //need to fix still
        if (selectedLocation && isPhotospot(selectedLocation)) {
            getPhotospotsPhotoshotTags(selectedLocation.id).then((tags) => {
                if (tags) {
                    setTags(tags);
                }
            })
        }

    }, [])
    const handleViewPhotospot = () => {
        if (isPhotospot(selectedLocation)) {
            router.push("/photospot/" + selectedLocation.id);
        }
    }
    return (
        <>
            <CardContent className="flex flex-col gap-4">
                {selectedLocation && isPhotospot(selectedLocation) ?
                    <>
                        {
                            !loadingSelectedLocation ?
                                <img src={selectedLocation?.top_photo_path ? selectedLocation.top_photo_path : DefaultPhotospot} alt="" className="w-full lg:h-[300px] rounded-md" />
                                : <Skeleton className="w-full h-[300px] rounded-md" />
                        }
                        <h1 className="text-3xl font-semibold">
                            {selectedLocation?.location_name ? selectedLocation.location_name : selectedLocation?.location_name}
                        </h1>
                        {selectedLocation?.rating && <RatingDisplay rating={selectedLocation.rating} />}
                        <div className=" flex flex-auto gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </> :
                    <>
                        {
                            !loadingSelectedLocation ?
                                <img src={DefaultPhotospot} alt="" className="w-full lg:h-[300px] rounded-md" />
                                : <Skeleton className="bg-slate-800/10 w-full h-[300px] rounded-md" />
                        }
                        <h1 className="text-3xl font-semibold">
                            {selectedLocation?.location_name ? selectedLocation.location_name : selectedLocation?.location_name}
                        </h1>
                    </>
                }
                <div className="flex justify-center flex-row gap-4">
                    <Dialog open={photoshotDialogOpen} onOpenChange={setPhotoshotDialogOpen}>
                        <DialogTrigger>
                            <div className={"text-2xl  " + cn(buttonVariants({ variant: "default" }))} >
                                Upload a shot
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <PhotoshotUploadDialog selectedLocation={selectedLocation} setPhotoshotDialogOpen={setPhotoshotDialogOpen} updatePhotobook={() => console.log("haha")} />
                        </DialogContent>
                    </Dialog>
                    {selectedLocation && isPhotospot(selectedLocation) &&
                        <Button variant="outline" onClick={() => { handleViewPhotospot(); }}>
                            View Photospot
                        </Button>}
                </div>

            </CardContent>



        </>

    )
}