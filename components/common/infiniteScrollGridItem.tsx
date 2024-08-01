"use client";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { DefaultPhotoshot, DefaultProfile } from "@/utils/common/imageLinks";
import {
  GridTypes,
  Photoshot,
  Photospot,
  Profile,
} from "@/types/photospotTypes";
import {
  isPhotoshot,
  isPhotospot,
  isProfile,
  isReview,
} from "@/utils/common/typeGuard";
import { Button } from "../ui/button";
import UserCard from "../profilePage/followingCard";
import FollowerCard from "../profilePage/followerCard";
import FollowingCard from "../profilePage/followingCard";
import PhotospotCard from "../timeline/photospotCard";
import PhotospotResult from "../explorePage/photospotResult";
import ReviewCard from "../review/review";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
export default function InfiniteScrollGridItem({
  gridItemData,
  gridType,
  height,
  extraInfo,
  showDetails,
}: {
  gridItemData: Photoshot | Photospot | Profile;
  gridType: GridTypes;
  height?: string;
  extraInfo?: string;
  showDetails?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const { data: top_photoshot } = useSWR(
    isPhotospot(gridItemData)
      ? "/api/photospot/" + gridItemData.id + "/topPhotoshot"
      : null,
    fetcher
  );
  return (
    <>
      {gridItemData &&
        isPhotospot(gridItemData) &&
        gridType === GridTypes.photospot && (
          <Link href={`/photospot/${gridItemData.id}`}>
            {top_photoshot?.photo_paths ? (
              <div
                className={`${
                  height ? "h-[" + height + "]" : "h-[400px]"
                } relative overflow-hidden`}
              >
                <Image
                  src={
                    hasError ? DefaultPhotoshot : top_photoshot.photo_paths[0]
                  }
                  alt={gridItemData.id ? gridItemData.id + "" : ""}
                  // sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
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
        )}
      {gridItemData &&
        isPhotospot(gridItemData) &&
        gridType === GridTypes.squarePhotospot && (
          <Link href={`/photospot/${gridItemData.id}`}>
            {top_photoshot?.photo_paths ? (
              <div className={`w-full aspect-square relative overflow-hidden`}>
                <Image
                  src={
                    hasError ? DefaultPhotoshot : top_photoshot.photo_paths[0]
                  }
                  alt={gridItemData.id ? gridItemData.id + "" : ""}
                  // sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                  onError={() => !hasError && setHasError(true)}
                  fill={true}
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
            )}
            {showDetails && (
              <div className="font-bold flex gap-4 flex-row items-center justify-between p-4">
                <h1>{gridItemData.location_name}</h1>
                {extraInfo && <h1>{extraInfo}</h1>}
              </div>
            )}
          </Link>
        )}
      {gridItemData &&
        isPhotoshot(gridItemData) &&
        gridType === GridTypes.photoshot && (
          <Link href={`/photoshot/${gridItemData.id}`}>
            {gridItemData.photo_paths[0] ? (
              <div
                className={`${
                  height ? "h-[" + height + "]" : "h-[400px]"
                } relative overflow-hidden`}
              >
                <Image
                  src={
                    hasError ? DefaultPhotoshot : gridItemData.photo_paths[0]
                  }
                  alt={gridItemData.id ? gridItemData.id + "" : ""}
                  // sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
                  // loading="eager"
                  onError={() => !hasError && setHasError(true)}
                  fill={true}
                  // blurDataURL={`/_next/image?url=${
                  //   hasError ? DefaultPhotoshot : gridItemData.photo_paths[0]
                  // }&w=16&q=1`}
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
        )}
      {gridItemData &&
        isPhotoshot(gridItemData) &&
        gridType === GridTypes.squarePhotoshot && (
          <Link href={`/photoshot/${gridItemData.id}`}>
            {gridItemData.photo_paths[0] ? (
              <div className={`fw-full relative overflow-hidden aspect-square`}>
                <Image
                  src={
                    hasError ? DefaultPhotoshot : gridItemData.photo_paths[0]
                  }
                  alt={gridItemData.id ? gridItemData.id + "" : ""}
                  // sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
                  // loading="eager"
                  onError={() => !hasError && setHasError(true)}
                  fill={true}
                  // blurDataURL={`/_next/image?url=${
                  //   hasError ? DefaultPhotoshot : gridItemData.photo_paths[0]
                  // }&w=16&q=1`}
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
            )}
            {showDetails && (
              <div className="font-bold flex gap-4 flex-wrap items-center justify-between p-4">
                <h1>{gridItemData.name}</h1>
                {extraInfo && <h1>{extraInfo}</h1>}
              </div>
            )}
          </Link>
        )}
      {gridItemData &&
        isProfile(gridItemData) &&
        (gridType === GridTypes.follower ? (
          <FollowerCard user={gridItemData} />
        ) : (
          <FollowingCard user={gridItemData} />
        ))}
      {gridItemData &&
        isPhotospot(gridItemData) &&
        gridType === GridTypes.photospotSearch && (
          <PhotospotResult photospot={gridItemData} />
        )}
      {gridItemData &&
        isReview(gridItemData) &&
        gridType === GridTypes.review && <ReviewCard review={gridItemData} />}
      {!gridItemData && (
        <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
      )}
    </>
  );
}
