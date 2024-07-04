"use client";
import { Modal } from "@/components/common/modal";
import PhotoshotCard from "@/components/homePage/photoshotCard";
import { Dialog } from "@/components/ui/dialog";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { GridTypes, Photoshot } from "@/types/photospotTypes";
import { Card } from "@/components/ui/card";
import InfiniteScrollGrid from "@/components/common/infiniteScrollGrid";
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
  return (
    <div className="flex flex-col items-center gap-8 m-8">
      <Card className="p-8">
        <Dialog>
          <div className="pl-20 pr-20">
            <PhotoshotCard photoshotId={parseInt(photoshotId)} />
          </div>
        </Dialog>
      </Card>
      <InfiniteScrollGrid
        gridData={photoshots}
        gridType={GridTypes.photoshot}
        setSize={setSize}
        size={size}
        dataLoading={photoshotsLoading}
        loadingAnimation={false}
      />
    </div>
  );
}
