"use client"
import PhotoshotTimelineGrid from "./photoshotTimelineGrid";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import PhotoshotGrid from "../photoshot/photoshotGrid";

export default function PopularPhotoshotTimelineContent() {
    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading: photoshotsLoading
    } = useSWRInfinite(
        (index) =>
            `/api/photoshot/timeline/popular?pageCount=${index + 1}`,
        fetcher
    );
    return (
        <>

            <PhotoshotGrid photoshots={data ? data : []} setSize={setSize} size={size} photoshotsLoading={photoshotsLoading} />
            {/* <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photoshot/timeline/popular?`} /> */}
        </>
    )
}