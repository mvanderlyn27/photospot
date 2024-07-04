"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";

export default function SuggestedPhotoshotTimelineContent() {
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) => `/api/photoshot/timeline/suggested?pageCount=${index + 1}`,
    fetcher
  );
  return (
    // <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photoshot/timeline/suggested?`} />
    // <PhotoshotGrid photoshots={data ? data : []} setSize={setSize} size={size} photoshotsLoading={photoshotsLoading} />
    <InfiniteScrollGrid
      gridData={data}
      gridType={GridTypes.photoshot}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
    />
  );
}
