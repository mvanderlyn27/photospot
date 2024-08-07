"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import { FaShareAlt } from "react-icons/fa";

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";
import SharePhotospotDialog from "../photospot/sharePhotospotDialog";
import RatingDisplay from "../review/ratingDisplay";
import { Skeleton } from "../ui/skeleton";

import { User } from "@supabase/supabase-js";
import PhotoTimeWidget from "../photospot/photoTimeWidget";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { round } from "@/utils/common/math";
import SavePhotospotButton from "../photospot/savePhotospotButton";
import { useBreakpoint } from "@/hooks/tailwind";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { DialogTitle } from "@radix-ui/react-dialog";
import { LuCalendarClock } from "react-icons/lu";

const TAG_LIMIT = 5;

export default function PhotospotInfo({
  id,
  user,
}: {
  id: number;
  user: User;
}) {
  // const { data: photospot, isLoading: photospotLoading, error: photospotError } = useQuery(getPhotospotById(id));
  const {
    data: photospot,
    isLoading: photospotLoading,
    error: photospotError,
  } = useSWR("/api/photospot/" + id, fetcher);
  // const { data: stats, isLoading: statsLoading, error: statsError } = useQuery(getPhotospotStatsById(id));

  //in the future update tags to have a limit
  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
  } = useSWR("/api/photospot/" + id + "/tags", fetcher);
  const { isLg } = useBreakpoint("lg");
  return (
    //setup skeelton for loading
    <>
      {photospotLoading && (
        <Skeleton className="h-full w-full bg-slate-800/10" />
      )}
      {photospot && isLg && (
        <Card
          className={`h-full flex flex-col ${photospot ? "" : "hidden"} m-4`}
        >
          <CardHeader className="flex-none">
            <CardTitle className="text-2xl md:text-3xl flex flex-row items-center justify-between">
              {photospot?.location_name}
              <div className="flex flex-row gap-2 items-center">
                {photospot && (
                  <PhotoshotUploadDialog
                    selectedLocation={photospot}
                    mapView={false}
                  />
                )}
                <Dialog>
                  <DialogTrigger className="h-full">
                    <Button className="h-full">
                      <FaShareAlt className="w-6 h-6" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="">
                    <SharePhotospotDialog id={id} />
                  </DialogContent>
                </Dialog>
                {user && <SavePhotospotButton id={id} />}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className=" flex flex-col gap-4 ">
            <RatingDisplay
              rating={
                photospot?.rating_average
                  ? round(photospot.rating_average, 1)
                  : 0
              }
              count={photospot?.rating_count ? photospot.rating_count : 0}
            />
            <div className=" flex flex-auto gap-2 overflow-auto">
              {tags &&
                tags.slice(0, TAG_LIMIT).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-nowrap">
                    {tag}
                  </Badge>
                ))}
            </div>
            <PhotoTimeWidget lat={photospot.lat} lng={photospot.lng} />
          </CardContent>
        </Card>
      )}
      {photospot && !isLg && (
        <Card
          className={`h-full flex flex-col ${photospot ? "" : "hidden"} m-4`}
        >
          <CardTitle className="text-2xl md:text-3xl p-4">
            {photospot.location_name}
          </CardTitle>
          <CardContent className=" flex flex-col gap-2 ">
            <Separator />
            <div className="flex flex-row justify-center items-center w-full p-2 gap-2">
              <PhotoshotUploadDialog
                selectedLocation={photospot}
                mapView={true}
              />
              <Dialog>
                <DialogTrigger className="h-full">
                  <Button className="h-full">
                    <LuCalendarClock className="w-6 h-6 md:w-8 md:h-8" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-4">
                  <DialogTitle>Golden Hour Times</DialogTitle>
                  <PhotoTimeWidget lat={photospot.lat} lng={photospot.lng} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="h-full">
                  <Button className="h-full">
                    <FaShareAlt className="w-6 h-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <SharePhotospotDialog id={id} />
                </DialogContent>
              </Dialog>
              {user && <SavePhotospotButton id={id} />}
            </div>
            <Separator />
            <div className="flex flex-col gap-4 pt-4 pb-4">
              <div className="flex flex-col gap-4">
                <Label>Rating:</Label>
                <RatingDisplay
                  rating={
                    photospot?.rating_average
                      ? round(photospot.rating_average, 1)
                      : 0
                  }
                  font="text-sm"
                  size={20}
                  count={photospot?.rating_count ? photospot.rating_count : 0}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label>Tags: </Label>
                <div className=" flex flex-auto gap-2 overflow-auto">
                  {tags &&
                    tags.slice(0, TAG_LIMIT).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-nowrap"
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
