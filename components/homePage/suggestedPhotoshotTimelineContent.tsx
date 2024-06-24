"use client"
import useSWRInfinite from "swr/infinite";
import PhotoshotGrid from "../photoshot/photoshotGrid";
import PhotoshotTimelineGrid from "./photoshotTimelineGrid";
import { fetcher } from "@/utils/common/fetcher";

export default function SuggestedPhotoshotTimelineContent() {
    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading: photoshotsLoading
    } = useSWRInfinite(
        (index) =>
            `/api/photoshot/timeline/suggested?pageCount=${index + 1}`,
        fetcher
    );
    return (
        // <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photoshot/timeline/suggested?`} />
        <PhotoshotGrid photoshots={data ? data : []} setSize={setSize} size={size} photoshotsLoading={photoshotsLoading} />
    )

}