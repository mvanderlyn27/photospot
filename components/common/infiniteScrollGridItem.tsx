"use client";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { DefaultPhotoshot } from "@/utils/common/imageLinks";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { isPhotospot } from "@/utils/common/typeGuard";
export default function InfiniteScrollGridItem({
  gridItemData,
  extraInfo,
}: {
  gridItemData: Photoshot | Photospot;
  extraInfo?: string;
}) {
  const [hasError, setHasError] = useState(false);
  console.log("grid item", gridItemData);
  return (
    <>
      {gridItemData &&
        (isPhotospot(gridItemData) ? (
          <Link href={`/photospot/${gridItemData.id}`}>
            {gridItemData.top_photoshot_path ? (
              <div className=" sm:h-[500px] md:h-[400px] relative overflow-hidden">
                <Image
                  src={
                    hasError
                      ? DefaultPhotoshot
                      : gridItemData.top_photoshot_path
                  }
                  alt={gridItemData.id ? gridItemData.id + "" : ""}
                  sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                  onError={() => !hasError && setHasError(true)}
                  fill={true}
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
            )}

            <div className="font-bold flex gap-4 flex-row items-center justify-between p-4">
              <h1>{gridItemData.location_name}</h1>
              {extraInfo && <h1>{extraInfo}</h1>}
            </div>
          </Link>
        ) : (
          <Link href={`/photoshot/${gridItemData.id}`}>
            {gridItemData.photo_paths[0] ? (
              <div className=" sm:h-[500px] md:h-[400px] relative overflow-hidden">
                <Image
                  src={
                    hasError ? DefaultPhotoshot : gridItemData.photo_paths[0]
                  }
                  alt={gridItemData.id ? gridItemData.id + "" : ""}
                  sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                  onError={() => !hasError && setHasError(true)}
                  fill={true}
                  blurDataURL={`/_next/image?url=${
                    hasError ? DefaultPhotoshot : gridItemData.photo_paths[0]
                  }&w=16&q=1`}
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
            )}

            <div className="font-bold flex gap-4 flex-row items-center justify-between p-4">
              <h1>{gridItemData.name}</h1>
              {extraInfo && <h1>{extraInfo}</h1>}
            </div>
          </Link>
        ))}
    </>
  );
}
