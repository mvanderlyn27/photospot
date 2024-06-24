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
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useSWR("/api/photospot/" + id + "/stats", fetcher);
  const {
    data: isSaved,
    mutate: updateSaved,
    isLoading: savedLoading,
    error: savedError,
  } = useSWR("/api/photospot/" + id + "/isSaved", fetcher);
  //in the future update tags to have a limit
  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
  } = useSWR("/api/photospot/" + id + "/tags", fetcher);
  const handleUpdateSaved = async () => {
    if (!photospot) return;
    if (isSaved) {
      console.log("un saveing ");
      updateSaved(handleUnsave(), { optimisticData: false });
    } else {
      console.log("saving");
      updateSaved(handleSave(), { optimisticData: true });
    }
  };
  const handleSave = async () => {
    return fetch("/api/photospot/" + id + "/save", { method: "post" }).then(
      (res) => true
    );
  };
  const handleUnsave = async () => {
    return fetch("/api/photospot/" + id + "/unSave", { method: "post" }).then(
      (res) => false
    );
  };
  return (
    //setup skeelton for loading
    <>
      {(photospotLoading || statsLoading) && (
        <Skeleton className="h-full w-full bg-slate-800/10" />
      )}
      {photospot && stats && (
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
                    <SharePhotospotDialog />
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => handleUpdateSaved()}
                  disabled={savedLoading}
                >
                  {isSaved ? (
                    <FaBookmark className="w-6 h-6" />
                  ) : (
                    <FaRegBookmark className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className=" flex flex-col gap-4 ">
            <RatingDisplay
              rating={stats?.rating_average ? stats.rating_average : 0}
              count={stats?.rating_count ? stats.rating_count : 0}
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
