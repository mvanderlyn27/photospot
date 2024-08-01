"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { useBreakpoint } from "@/hooks/tailwind";
import { getCols } from "@/utils/responsive/grids";

export default function MyPhotoshots({ userId }: { userId: string }) {
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photoshot/user/${userId}/getPhotoshots?pageCount=${index + 1}`,
    fetcher
  );
  const { isXl } = useBreakpoint("xl");
  return (
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={GridTypes.squarePhotoshot}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
      colCount={getCols({ sm: 3, md: 3, lg: 4, xl: 4 })}
      showDetails={isXl}
    />
  );
}
