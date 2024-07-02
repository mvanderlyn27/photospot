"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import PhotoshotGrid from "../photoshot/photoshotGrid";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";

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

  return (
    <InfiniteScrollGrid
      gridData={data}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
    />
  );
}
