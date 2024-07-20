"use client";
import { Photospot, PhotospotStats } from "@/types/photospotTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import GoldenHourDisplay from "../photospot/photoTimeSelector";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { FaShareAlt } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
import { savePhotospot } from "@/app/serverActions/photospots/savePhotospot";
import { getSavedPhotospot } from "@/app/serverActions/photospots/getSavedPhotospots";
import { unsavePhotospot } from "@/app/serverActions/photospots/unsavePhotospot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import SharePhotospotDialog from "../photospot/sharePhotospotDialog";
import RatingDisplay from "../review/ratingDisplay";
import PhotoTimes from "../photospot/photoTimeSelector";
import { Skeleton } from "../ui/skeleton";
import {
  getPhotospotById,
  getPhotospotStatsById,
  getUserSavedPhotospots,
} from "@/app/supabaseQueries/photospot";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { UserIdentity, UserResponse } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";
import PhotoTimeWidget from "../photospot/photoTimeWidget";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import useSWRMutation from "swr/dist/mutation";
import { round } from "@/utils/common/math";
import SavePhotospotButton from "../photospot/savePhotospotButton";

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
  return (
    //setup skeelton for loading
    <>
      {photospotLoading && (
        <Skeleton className="h-full w-full bg-slate-800/10" />
      )}
      {photospot && (
        <Card className={`h-full flex flex-col ${photospot ? "" : "hidden"}`}>
          <CardHeader className="flex-none">
            <div className="flex flex-row justify-between">
              <CardTitle className="text-3xl">
                <div className="flex flex-row gap-4">
                  {photospot?.location_name}
                </div>
              </CardTitle>
              <div className="flex flex-row gap-2">
                <Dialog>
                  <DialogTrigger>
                    <div className={cn(buttonVariants({ variant: "default" }))}>
                      <FaShareAlt className="w-6 h-6" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <SharePhotospotDialog id={id} />
                  </DialogContent>
                </Dialog>
                {user && <SavePhotospotButton id={id} />}
              </div>
            </div>
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
            <div className=" flex flex-auto gap-2">
              {tags &&
                tags.slice(0, TAG_LIMIT).map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </div>
            <PhotoTimeWidget lat={photospot.lat} lng={photospot.lng} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
