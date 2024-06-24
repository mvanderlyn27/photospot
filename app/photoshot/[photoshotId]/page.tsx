"use client"
import { Modal } from "@/components/common/modal";
import PhotoshotTimelineGrid from "@/components/homePage/photoshotTimelineGrid";
import TimelineDialogCard from "@/components/homePage/timelineDialogCard";
import { Dialog } from "@/components/ui/dialog";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { Photoshot } from "@/types/photospotTypes";
import PhotoshotGrid from "@/components/photoshot/photoshotGrid";
import { Card } from "@/components/ui/card";
export default function PhotoshotModal({ params: { photoshotId } }: { params: { photoshotId: string } }) {

    const [photoshots, setPhotoshots] = useState<Photoshot[][]>([]);
    const { data: photoshot } = useSWR(`/api/photoshot/${photoshotId}`, fetcher)
    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading: photoshotsLoading
    } = useSWRInfinite(
        (index) =>
            `/api/photospot/${photoshot.photospot_id}/photoshots?pageCount=${index + 1}`,
        fetcher
    );
    useEffect(() => {
        if (data) {
            setPhotoshots(data);
        }
    }, [data]);
    return (
        <div className="flex flex-col items-center gap-8 m-8">
            <Card className="p-8">
                <Dialog>
                    <div className="pl-20 pr-20">
                        <TimelineDialogCard photoshotId={parseInt(photoshotId)} />
                    </div>
                </Dialog>

            </Card>
            {/* Need to update to pull in other photoshots besides this one */}
            {/* {photoshot && <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photospot/${photoshot.photospot_id}/photoshots?`} />} */}

            <PhotoshotGrid photoshots={photoshots} setSize={setSize} size={size} photoshotsLoading={photoshotsLoading} />
        </div>

    );
}