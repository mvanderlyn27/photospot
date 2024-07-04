"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import PhotoshotGrid from "../photoshot/photoshotGrid";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";

export default function PopularPhotoshotTimelineContent() {
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) => `/api/photoshot/timeline/popular?pageCount=${index + 1}`,
    fetcher
  );
  return (
    <>
      {/* <PhotoshotGrid photoshots={data ? data : []} setSize={setSize} size={size} photoshotsLoading={photoshotsLoading} /> */}
      <InfiniteScrollGrid
        gridData={data}
        gridType={GridTypes.photoshot}
        setSize={setSize}
        size={size}
        dataLoading={photoshotsLoading}
      />
      {/* <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photoshot/timeline/popular?`} /> */}
    </>
  );
}
