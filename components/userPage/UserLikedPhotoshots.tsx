"use client";

import useSWRInfinite from "swr/infinite";
import PhotoshotGrid from "../photoshot/photoshotGrid";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";

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

  return (
    // <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photoshot/timeline/suggested?`} />
    <PhotoshotGrid
      photoshots={data ? data : []}
      setSize={setSize}
      size={size}
      photoshotsLoading={photoshotsLoading}
    />
  );
}
