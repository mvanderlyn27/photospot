"use client";

import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/utils/common/fetcher";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { useBreakpoint } from "@/hooks/tailwind";
import { getCols } from "@/utils/responsive/grids";

export default function UserLikedPhotoshots({ userId }: { userId: string }) {
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photoshot/user/${userId}/getLikedPhotoshots?pageCount=${index + 1}`,
    fetcher
  );
  const { isSm } = useBreakpoint("sm");
  return (
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={!isSm ? GridTypes.mobilePhotoshot : GridTypes.photoshot}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
      colCount={getCols({ sm: 3 })}
    />
  );
}
