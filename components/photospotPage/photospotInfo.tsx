"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
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
