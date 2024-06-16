"use client";
import { NewPhotospotInfo, Photoshot, Photospot } from "@/types/photospotTypes";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { DefaultPhotospot } from "@/utils/common/imageLinks";
import RatingDisplay from "../review/ratingDisplay";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { isPhotospot } from "@/utils/common/typeGuard";
import EditPhotospotDialog from "./editPhotospotDialog";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";

export default function PhotospotPreview({
  selectedLocation,
}: {
  selectedLocation: Photospot | NewPhotospotInfo | null;
}) {
  const {
    data: topPhotoshot,
    isLoading: topPhotoshotLoading,
  }: { data: Photoshot | null; isLoading: boolean } = useSWR(
    isPhotospot(selectedLocation)
      ? `/api/photospot/${selectedLocation?.id}/topPhotoshot`
      : null,
    fetcher
  );
  const [tags, setTags] = useState<string[]>([]);
  const [locationName, setLocationName] = useState<string>(
    selectedLocation ? selectedLocation?.location_name : ""
  );
  const selectedPhotospot = isPhotospot(selectedLocation);
  const router = useRouter();
  const handleViewPhotospot = () => {
    if (selectedPhotospot) {
      router.push("/photospot/" + selectedLocation.id);
    }
  };
  const setPhotospotName = (name: string) => {
    if (selectedLocation) {
      selectedLocation.location_name = name;
      setLocationName(name);
    }
  };
  return (
    <>
      <CardContent className="flex flex-col gap-4">
        {selectedLocation && isPhotospot(selectedLocation) && (
          <>
            {}
            {topPhotoshot && (
              <img
                src={topPhotoshot.photo_paths[0]}
                alt=""
                className="w-full lg:h-[300px] rounded-md"
              />
            )}
            {topPhotoshotLoading && (
              <Skeleton className="w-full lg:h-[300px] rounded-md" />
            )}
            <h1 className="text-3xl font-semibold">
              {selectedLocation?.location_name
                ? selectedLocation.location_name
                : selectedLocation?.location_name}
            </h1>
            {selectedLocation?.rating && (
              <RatingDisplay rating={selectedLocation.rating} />
            )}
            <div className=" flex flex-auto gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}
        {selectedLocation &&
          !topPhotoshotLoading &&
          (!isPhotospot(selectedLocation) || !topPhotoshot) && (
            <>
              <img
                src={DefaultPhotospot}
                alt=""
                className="w-full lg:h-[300px] rounded-md"
              />
              <div className="flex flex-row gap-4">
                <h1 className="text-3xl font-semibold">
                  {selectedLocation?.location_name
                    ? selectedLocation.location_name
                    : selectedLocation?.location_name}
                </h1>
                {selectedLocation && !selectedPhotospot && (
                  <EditPhotospotDialog
                    photospotName={selectedLocation.location_name}
                    setPhotospotName={setPhotospotName}
                  />
                )}
              </div>
              {!selectedPhotospot && (
                <p className="text-xl">New Location, upload the first pic!</p>
              )}
            </>
          )}
        <div className="flex justify-center flex-row gap-4">
          <PhotoshotUploadDialog
            selectedLocation={selectedLocation}
            mapView={true}
          />
          {selectedPhotospot && (
            <Button
              variant="outline"
              onClick={() => {
                handleViewPhotospot();
              }}
            >
              View Photospot
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
}
