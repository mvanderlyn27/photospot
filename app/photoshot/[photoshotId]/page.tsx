"use client";
import { Modal } from "@/components/common/modal";
import PhotoshotCard from "@/components/homepage/photoshotCard";
import { Dialog } from "@/components/ui/dialog";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { GridTypes, Photoshot } from "@/types/photospotTypes";
import { Card } from "@/components/ui/card";
import InfiniteScrollGrid from "@/components/common/infiniteScrollGrid";
import { useBreakpoint } from "@/hooks/tailwind";
import { getCols } from "@/utils/responsive/grids";
export default function PhotoshotModal({
  params: { photoshotId },
}: {
  params: { photoshotId: string };
}) {
  const [photoshots, setPhotoshots] = useState<Photoshot[][]>([]);
  const { data: photoshot } = useSWR(`/api/photoshot/${photoshotId}`, fetcher);
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photospot/${photoshot.photospot_id}/photoshots?pageCount=${
        index + 1
      }`,
    fetcher
  );
  useEffect(() => {
    if (data) {
      setPhotoshots(data);
    }
  }, [data]);
  const { isSm } = useBreakpoint("sm");
  const { isMd } = useBreakpoint("md");
  const { isLg } = useBreakpoint("lg");
  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 p-4 md:m-8 w-full">
      <Card className="p-4 md:p-8">
        <Dialog>
          <div className="md:pl-20 md:pr-20">
            <PhotoshotCard photoshotId={parseInt(photoshotId)} />
          </div>
        </Dialog>
      </Card>
      <h1 className="text-2xl font-bold">Other Photos Taken Here:</h1>
      <InfiniteScrollGrid
        gridData={photoshots}
        gridType={!isLg ? GridTypes.mobilePhotoshot : GridTypes.photoshot}
        setSize={setSize}
        size={size}
        dataLoading={photoshotsLoading}
        loadingAnimation={false}
        colCount={getCols()}
        // height={!isSm ? "200px" : "400px"}
      />
    </div>
  );
}
