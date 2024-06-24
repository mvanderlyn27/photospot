"use client";
import { fetcher } from "@/utils/common/fetcher";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { Photoshot } from "@/types/photospotTypes";
import { Skeleton } from "../ui/skeleton";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import PhotoshotGrid from "../photoshot/photoshotGrid";
import { useEffect, useState } from "react";
export function PhotospotPhotoSection({ id }: { id: number }) {
  const [photoshots, setPhotoshots] = useState<Photoshot[][]>([]);
  const {
    data: photospot,
    isLoading: photospotLoading,
    error: photospotError,
  } = useSWR(`/api/photospot/${id}`, fetcher);
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading
  } = useSWRInfinite(
    (index) =>
      `/api/photospot/${id}/photoshots?pageCount=${index + 1}`,
    fetcher
  );
  useEffect(() => {
    if (data) {
      setPhotoshots(data);
    }
  }, [data])
  return (
    <div className="flex flex-col gap-4">
      {/* <Skeleton className="bg-balck/10 h-[600px] w-full" /> */}
      <div className="flex flex-row ">
        <PhotoshotUploadDialog selectedLocation={photospot} mapView={false} />
      </div>
      {/* <PhotoshotGrid photospotId={id} /> */}
      <PhotoshotGrid photoshots={photoshots} setSize={setSize} size={size} photoshotsLoading={photoshotsLoading} />
    </div>
  );
}
