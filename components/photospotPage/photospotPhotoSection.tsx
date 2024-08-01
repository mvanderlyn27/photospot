"use client";
import { fetcher } from "@/utils/common/fetcher";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { GridTypes, Photoshot } from "@/types/photospotTypes";
import { Skeleton } from "../ui/skeleton";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { useBreakpoint } from "@/hooks/tailwind";
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
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) => `/api/photospot/${id}/photoshots?pageCount=${index + 1}`,
    fetcher
  );
  useEffect(() => {
    if (data) {
      setPhotoshots(data);
    }
  }, [data]);
  const { isSm } = useBreakpoint("sm");
  return (
    <div className="flex flex-col p-4 md:gap-4">
      {/* <Skeleton className="bg-balck/10 h-[600px] w-full" /> */}

      <InfiniteScrollGrid
        gridData={photoshots}
        gridType={!isSm ? GridTypes.mobilePhotoshot : GridTypes.photoshot}
        setSize={setSize}
        size={size}
        dataLoading={photoshotsLoading}
        // height={isSm ? "400px" : "200px"}
        colCount={{ sm: 3 }}
      />
    </div>
  );
}
