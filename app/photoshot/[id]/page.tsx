"use client"
import { Modal } from "@/components/common/modal";
import PhotoshotTimelineGrid from "@/components/homePage/photoshotTimelineGrid";
import TimelineDialogCard from "@/components/homePage/timelineDialogCard";
import { Dialog } from "@/components/ui/dialog";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";

export default function Photoshot({ params: { id } }: { params: { id: string } }) {
    const { data: photoshot } = useSWR(`/api/photoshot/${id}`, fetcher)
    return (
        <div className="flex flex-col items-center">
            <Dialog>
                <div className="pl-20 pr-20">
                    <TimelineDialogCard photoshotId={parseInt(id)} />
                </div>
            </Dialog>
            {/* Need to update to pull in other photoshots besides this one */}
            {/* {photoshot && <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photospot/${photoshot.photospot_id}/photoshots?`} />} */}
        </div>

    );
}