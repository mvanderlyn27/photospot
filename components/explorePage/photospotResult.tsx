"use client";
import Image from "next/image";
import { Photospot } from "@/types/photospotTypes";
import { DefaultPhotospot } from "@/utils/common/imageLinks";
import { AspectRatioIcon } from "@radix-ui/react-icons";
import { AspectRatio } from "../ui/aspect-ratio";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "@/utils/common/fetcher";
import useSWR, { preload } from "swr";
import { Skeleton } from "../ui/skeleton";
import RatingDisplay from "../review/ratingDisplay";
import { round } from "@/utils/common/math";
import { parseAsInteger, useQueryState } from "nuqs";
import { useBreakpoint } from "@/hooks/tailwind";

export default function PhotospotResult({ photospot }: { photospot: Photospot }) {
  const distanceString = photospot?.dist_meters ? " " + round(photospot.dist_meters, 2) + "m" : "";
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState("selectedPhotospot", parseAsInteger);
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace, push } = useRouter();
  // const params = new URLSearchParams(searchParams);
  // const selectedRaw = params.get("selectedPhotospot");
  // const selected = selectedRaw && parseInt(selectedRaw) === photospot.id;
  const { data: topPhotoshot } = useSWR(`/api/photospot/${photospot.id}/topPhotoshot`, fetcher);

  const handleClick = () => {
    setSelectedPhotospot(photospot.id, { shallow: true });
    preload("/api/photospot/" + photospot.id + "/topPhotoshot", fetcher);
    preload(`/api/photospot/${photospot.id}`, fetcher);
    // params.set("selectedPhotospot", photospot.id.toString());
    // replace(`${pathname}?${params.toString()}`, { scroll: true });
    // window.history.pushState(null, "", `?${params.toString()}`);
  };
  const { isSm } = useBreakpoint("sm");
  return (
    <div>
      {isSm && (
        <div
          className={`flex flex-row hover:bg-gray-100 cursor-pointer gap-4 w-full ${
            selectedPhotospot === photospot.id ? "bg-gray-100" : ""
          }`}
          onClick={handleClick}>
          <div className="relative h-[300px] w-[300px] rounded">
            {topPhotoshot ? (
              <Image
                src={topPhotoshot.photo_paths ? topPhotoshot.photo_paths[0] : ""}
                alt="Image"
                className="rounded-t-md object-cover z-1"
                fill
              />
            ) : (
              <Skeleton className="bg-black/10 object-cover rounded w-full h-[300px]" />
            )}
          </div>
          {photospot && (
            <div className="w-3/4 flex flex-col justify-center gap-4">
              <h1 className="text-xl font-bold">{photospot.location_name}</h1>
              <h1 className="text-sm">
                <b>{photospot.neighborhood}</b>
                {distanceString}
              </h1>
              <RatingDisplay
                rating={photospot?.rating_average ? round(photospot.rating_average, 1) : 0}
                count={photospot?.rating_count ? photospot.rating_count : 0}
                size={20}
                font="text-sm"
              />
            </div>
          )}
        </div>
      )}
      {!isSm && (
        <div className="flex flex-row gap-2" onClick={handleClick}>
          <div className="relative aspect-square w-full rounded">
            {topPhotoshot ? (
              <Image
                src={topPhotoshot.photo_paths ? topPhotoshot.photo_paths[0] : ""}
                alt="Image"
                className="rounded-t-md object-cover z-1"
                fill
              />
            ) : (
              <Skeleton className="bg-black/10 object-cover rounded w-full h-[300px]" />
            )}
          </div>
          {photospot && (
            <div className="w-full flex flex-col justify-center gap-2">
              <h1 className="text-lg ">{photospot.location_name}</h1>
              <h1 className="text-sm">
                <b>{photospot.neighborhood}</b>
                {distanceString}
              </h1>
              <RatingDisplay
                rating={photospot?.rating_average ? round(photospot.rating_average, 1) : 0}
                count={photospot?.rating_count ? photospot.rating_count : 0}
                size={20}
                font="text-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
