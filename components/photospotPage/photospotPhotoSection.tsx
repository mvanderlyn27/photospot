"use client";
import { fetcher } from "@/utils/common/fetcher";
import PhotoshotGrid from "./photoshotGrid";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { Skeleton } from "../ui/skeleton";
import useSWR from "swr";

export function PhotospotPhotoSection({ id }: { id: number }) {
  const {
    data: photospot,
    isLoading: photospotLoading,
    error: photospotError,
  } = useSWR(`/api/photospot/${id}`, fetcher);
  return (
    <div className="flex flex-col gap-4">
      {/* <Skeleton className="bg-balck/10 h-[600px] w-full" /> */}
      <div className="flex flex-row ">
        <PhotoshotUploadDialog selectedLocation={photospot} mapView={false} />
      </div>
      <PhotoshotGrid photospotId={id} />
    </div>
  );
}
