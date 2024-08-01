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
import { getCols } from "@/utils/responsive/grids";
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
  const { isXl } = useBreakpoint("xl");
  return (
    <div className="flex flex-col p-4 md:gap-4">
      {/* <Skeleton className="bg-balck/10 h-[600px] w-full" /> */}

      <InfiniteScrollGrid
        gridData={data ? data : []}
        gridType={GridTypes.squarePhotoshot}
        setSize={setSize}
        size={size}
        dataLoading={photoshotsLoading}
        colCount={getCols({ sm: 3, md: 3, lg: 4, xl: 4 })}
        showDetails={isXl}
      />
    </div>
  );
}
