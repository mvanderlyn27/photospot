"use client";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import PhotoshotGrid from "../photoshot/photoshotGrid";

export default function UserSavedPhotospots({ userId }: { userId: string }) {
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photospot/user/${userId}/getSavedPhotospots?pageCount=${index + 1}`,
    fetcher
  );
  useEffect(() => {
    console.log("data: ", data);
    //get top photoshots for all photospots
  }, [data]);
  return (
    <PhotoshotGrid
      photoshots={data ? data : []}
      setSize={setSize}
      size={size}
      photoshotsLoading={photospotsLoading}
    />
  );
}
