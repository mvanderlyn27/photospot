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
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";
import { useBreakpoint } from "@/hooks/tailwind";
import Image from "next/image";
import EditPhotospotForm from "./editPhotospotForm";
import PhotoshotUploadForm from "../photoshot/photoshotUploadForm";
import { Dialog, DialogContent } from "../ui/dialog";

export default function PhotospotPreview({ selectedLocation }: { selectedLocation: Photospot | NewPhotospotInfo }) {
  const { data: topPhotoshot, isLoading: topPhotoshotLoading }: { data: Photoshot | null; isLoading: boolean } = useSWR(
    isPhotospot(selectedLocation) ? `/api/photospot/${selectedLocation?.id}/topPhotoshot` : null,
    fetcher
  );
  const [locationName, setLocationName] = useState<string>(selectedLocation ? selectedLocation?.location_name : "");
  const [editTitle, setEditTitle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadPhotospot, setUploadPhotospot] = useState(false);
  const selectedPhotospot = isPhotospot(selectedLocation);
  const router = useRouter();
  const handleViewPhotospot = () => {
    if (selectedPhotospot) {
      router.push("/photospot/" + selectedLocation.id);
    }
  };
  const { isSm } = useBreakpoint("sm");
  const setPhotospotName = (name: string) => {
    if (selectedLocation) {
      selectedLocation.location_name = name;
      setLocationName(name);
    }
  };
  useEffect(() => {
    if (selectedLocation) {
      setEditTitle(false);
      setUploadPhotospot(false);
    }
  }, [selectedLocation]);
  return (
    <>
      <CardContent className="flex flex-col h-full gap-4">
        {!editTitle && !uploadPhotospot && (
          <>
            {!topPhotoshotLoading && (
              <div className="w-full h-[300px]  relative">
                <Image
                  src={!selectedPhotospot ? DefaultPhotospot : topPhotoshot?.photo_paths[0]!}
                  alt=""
                  fill
                  className="object-cover rounded-md p-4"
                />
              </div>
            )}
            {topPhotoshotLoading && <Skeleton className="w-full h-[300px] lg:h-[300px] rounded-md bg-black/10" />}

            <div className="flex flex-row gap-4 justify-center items-center">
              <h1 className="text-xl font-semibold">
                {selectedLocation?.location_name ? selectedLocation.location_name : selectedLocation?.location_name}
              </h1>
              {!selectedPhotospot && (
                <Button onClick={() => setEditTitle(true)} variant="outline" disabled={loading}>
                  Edit
                </Button>
              )}
            </div>
            <div className="flex justify-center flex-row gap-4">
              <Button onClick={() => setUploadPhotospot(true)}>Upload a shot</Button>

              {selectedPhotospot && (
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    handleViewPhotospot();
                  }}>
                  View Photospot
                </Button>
              )}
            </div>
          </>
        )}
        {uploadPhotospot && (
          <Dialog open={true}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] md:max-w-[40vw]  flex flex-col justify-center ">
              <PhotoshotUploadForm
                selectedLocation={selectedLocation}
                mapView={true}
                handleCancel={() => setUploadPhotospot(false)}
              />
            </DialogContent>
          </Dialog>
        )}
        {editTitle && (
          <EditPhotospotForm
            photospotName={selectedLocation.location_name}
            setPhotospotName={setPhotospotName}
            handleCancel={() => setEditTitle(false)}
            handleSubmit={() => setEditTitle(false)}
          />
        )}
      </CardContent>
    </>
  );
}
