"use client";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { DefaultPhotoshot } from "@/utils/common/imageLinks";
import { Photoshot } from "@/types/photospotTypes";
export default function PhotoshotGridImage({
  photoshot,
  extraInfo,
}: {
  photoshot: Photoshot;
  extraInfo?: string;
}) {
  const [hasError, setHasError] = useState(false);
  return (
    <>
      <Link href={`/photoshot/${photoshot.id}`}>
        {photoshot.photo_paths[0] ? (
          <div className=" sm:h-[500px] md:h-[400px] relative overflow-hidden">
            <Image
              src={hasError ? DefaultPhotoshot : photoshot.photo_paths[0]}
              alt={photoshot.id ? photoshot.id + "" : ""}
              sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
              loading="eager"
              onError={() => !hasError && setHasError(true)}
              fill={true}
              blurDataURL={`/_next/image?url=${
                hasError ? DefaultPhotoshot : photoshot.photo_paths[0]
              }&w=16&q=1`}
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
        )}

        <div className="font-bold flex gap-4 flex-row items-center justify-between p-4">
          <h1>{photoshot.name}</h1>
          {extraInfo && <h1>{extraInfo}</h1>}
        </div>
      </Link>
    </>
  );
}
