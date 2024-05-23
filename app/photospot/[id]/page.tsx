"use client";
import { getPhotospotById } from "@/app/serverActions/photospots/getPhotospotById";
import { getTestImages } from "@/app/serverActions/storage/getTestImages";
import PhotospotGrid from "@/components/photospot/photospotGrid";
import PreviewMap from "@/components/maps/previewMap";
import PhotospotInfo from "@/components/photospot/photospotInfo";
import { Photospot, ReviewGridInput } from "@/types/photospotTypes";
import { useEffect, useState } from "react";
import ReviewGrid from "@/components/review/reviewGrid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import CreateReviewDialog from "@/components/review/createReviewDialog";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function PhotospotPage({ params }: { params: { id: string } }) {
    const [photospotData, setPhotoSpotData] = useState<Photospot | null>(null);
    const [testPhotospots, setTestPhotospots] = useState<ReviewGridInput[]>([]);
    useEffect(() => {
        //pull info from photospot based on id
        getPhotospotById(parseInt(params.id)).then((photospot: Photospot) => {
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
        <div className="flex flex-col justify-center gap-8 w-full pl-20 pr-20">
            <div className="flex flex-row gap-24 w-full justify-center h-[500px] ">
                <div className="flex-1  h-50vh">
                    <PhotospotInfo photospot={photospotData} />
                </div>
                <div className="flex-1  h-50vh">
                    {photospotData?.lat && photospotData?.lng && <PreviewMap lat={photospotData.lat} lng={photospotData.lng} />}
                </div>
            </div>
            <div className="flex flex-row gap-24  w-full justify-center">
                <h1 className="text-2xl font-semibold ">User Impressions</h1>
                <Dialog>
                    <DialogTrigger>
                        <div className={"text-2xl  " + cn(buttonVariants({ variant: 'default' }))}>Add Yours</div>
                    </DialogTrigger>
                    <DialogContent>
                        <CreateReviewDialog photospot={photospotData} />
                    </DialogContent>
                </Dialog>
            </div>

            <ReviewGrid input={testPhotospots} />
        </div>
    );
}
