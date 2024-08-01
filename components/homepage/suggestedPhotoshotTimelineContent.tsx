"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { getCols } from "@/utils/responsive/grids";
import { useBreakpoint } from "@/hooks/tailwind";

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
    <InfiniteScrollGrid
      gridData={data}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
      gridType={GridTypes.squarePhotoshot}
      colCount={getCols({ sm: 2, md: 2, lg: 3, xl: 5 })}
      showDetails={true}
    />
  );
}
