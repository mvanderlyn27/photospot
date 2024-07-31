"use client";

import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { useBreakpoint } from "@/hooks/tailwind";

export default function MyLikedPhotoshots() {
  const { data: user } = useSWR("/api/profile", fetcher);
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photoshot/user/${user.id}/getLikedPhotoshots?pageCount=${
        index + 1
      }`,
    fetcher
  );

  const { isSm } = useBreakpoint("sm");
  return (
    // <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photoshot/timeline/suggested?`} />
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={!isSm ? GridTypes.mobilePhotoshot : GridTypes.photoshot}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
      colCount={{
        sm: 3,
      }}
    />
  );
}
