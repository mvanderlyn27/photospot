"use client";
import { getById } from "@/app/serverActions/photospots/getById";
import { getTestImages } from "@/app/serverActions/storage/getTestImages";
import PhotospotGrid from "@/components/photospot/photospotGrid";
import PreviewMap from "@/components/maps/previewMap";
import PhotospotInfo from "@/components/photospot/photospotInfo";
import { Photospot, ReviewGridInput } from "@/types/photospotTypes";
import { useEffect, useState } from "react";
import ReviewGrid from "@/components/photospot/reviewGrid";

export default function PhotospotPage({ params }: { params: { id: string } }) {
    const [photospotData, setPhotoSpotData] = useState<Photospot | null>(null);
    const [testPhotospots, setTestPhotospots] = useState<ReviewGridInput[]>([]);
    useEffect(() => {
        //pull info from photospot based on id
        getById(parseInt(params.id)).then((photospot: Photospot) => {
            setPhotoSpotData(photospot);
        });
        getTestImages().then((photospots) => {
            let test_photospots: ReviewGridInput[] = [];
            photospotData?.photo_paths.forEach((photo_path) => {
                test_photospots.push({
                    name: photospotData?.name,
                    path: photo_path,
                    review: 'very cool spot :D:D'
                })
            });
            for (let i = 0; i < photospots.length; i++) {
                test_photospots.push({
                    name: 'test image ' + i,
                    path: photospots[i],
                    review: 'very cool spot :D:D'
                })
            }
            setTestPhotospots(test_photospots);
        })

    }, [params.id]);
    return (
        <div className="flex flex-col justify-center gap-8 w-full">
            <div className="flex flex-row gap-8 w-[1800px] h-[500px] m-auto">
                <div className="flex-1 p-8 h-50vh">
                    <PhotospotInfo photospot={photospotData} />
                </div>
                <div className="flex-1 p-8 h-50vh">
                    {photospotData?.lat && photospotData?.lng && <PreviewMap lat={photospotData.lat} lng={photospotData.lng} />}
                </div>
            </div>
            <ReviewGrid input={testPhotospots} />
        </div>
    );
}
