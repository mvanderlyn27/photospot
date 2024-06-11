"use client"
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { DefaultPhotospot } from "@/utils/common/imageLinks";
import RatingDisplay from "../review/ratingDisplay";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { isPhotospot } from "@/utils/common/typeGuard";

export default function PhotospotPreview({ selectedLocation }: { selectedLocation: Photospot | NewPhotospotInfo | null }) {
    const [tags, setTags] = useState<string[]>([]);
    const router = useRouter();
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
                        <img src={selectedLocation?.top_photo_path ? selectedLocation.top_photo_path : DefaultPhotospot} alt="" className="w-full lg:h-[300px] rounded-md" />
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
                        <img src={DefaultPhotospot} alt="" className="w-full lg:h-[300px] rounded-md" />
                        <h1 className="text-3xl font-semibold">
                            {selectedLocation?.location_name ? selectedLocation.location_name : selectedLocation?.location_name}
                        </h1>
                    </>
                }
                <div className="flex justify-center flex-row gap-4">
                    <PhotoshotUploadDialog selectedLocation={selectedLocation} mapView={true} />
                    {selectedLocation && isPhotospot(selectedLocation) &&
                        <Button variant="outline" onClick={() => { handleViewPhotospot(); }}>
                            View Photospot
                        </Button>}
                </div>
            </CardContent>
        </>
    )
}