"use client";
import {
  Photoshot,
  Photospot,
  Review,
  ReviewGridInput,
} from "@/types/photospotTypes";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { UserIdentity } from "@supabase/supabase-js";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import PhotoshotDialog from "./photoshotDialog";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import { arrayRange } from "@/utils/common/math";
export default function PhotoshotGrid({
  photospotId,
}: {
  photospotId: number;
}) {
  const {
    data: photoshots,
    isLoading: photoshotLoading,
    error: photoshotError,
  } = useSWR("/api/photospot/" + photospotId + "/photoshots", fetcher);
  return (
    <div className=" w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4  grid-flow-row-dense">
        {photoshots &&
          photoshots?.map((photoshot: Photoshot) => (
            <PhotoshotDialog photoshotId={photoshot.id} />
          ))}
        {photoshotLoading &&
          arrayRange(0, 10, 1).map((i) => (
            <Skeleton
              key={i}
              className="bg-black/10 object-cover rounded w-full aspect-square"
            />
          ))}
      </div>
    </div>
  );
}
