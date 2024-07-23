"use client";
import { fetcher } from "@/utils/common/fetcher";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SavePhotospotButton from "../photospot/savePhotospotButton";
import { round } from "@/utils/common/math";
import RatingDisplay from "../review/ratingDisplay";
import { Badge } from "../ui/badge";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ReviewGrid from "../review/reviewGrid";
import SharePhotospotButton from "../photospot/sharePhotospotButton";
import { Separator } from "../ui/separator";
import PhotospotDirectionsButton from "../photospot/photospotDirectionsButton";
import { Button } from "../ui/button";
import { MdClose } from "react-icons/md";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

const TAG_LIMIT = 5;
export default function PhotospotPreview({}) {
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState(
    "selectedPhotospot",
    parseAsInteger
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const params = new URLSearchParams(searchParams);
  // const selectedPhotospotRaw = params.get("selectedPhotospot");
  // const selectedPhotospot = selectedPhotospotRaw
  // ? parseInt(selectedPhotospotRaw)
  // : undefined;
  const [tab, setTab] = useQueryState("tab", parseAsString);
  const latRaw = params.get("lat");
  const lat = latRaw ? parseFloat(latRaw) : undefined;

  const lngRaw = params.get("lng");
  const lng = lngRaw ? parseFloat(lngRaw) : undefined;
  console.log("selectedPhotospot", selectedPhotospot, lat, lng, latRaw, lngRaw);
  const { data: photospot } = useSWR(
    `/api/photospot/${selectedPhotospot}${
      lat && lng && `?lat=${lat}&lng=${lng}`
    }`,
    fetcher
  );
  const { data: topPhotoshot } = useSWR(
    `/api/photospot/${selectedPhotospot}/topPhotoshot`,
    fetcher
  );
  const { data: profile } = useSWR(`/api/profile/`, fetcher);
  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
  } = useSWR(`/api/photospot/${selectedPhotospot}/tags`, fetcher);
  const {
    data: photoshots,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photospot/${selectedPhotospot}/photoshots?pageCount=${index + 1}`,
    fetcher
  );
  const visitPhotospot = () => {
    push("/photospot/" + selectedPhotospot);
  };
  const closePreview = () => {
    // params.delete("selectedPhotospot");
    // replace(`${pathname}?${params.toString()}`);
    setSelectedPhotospot(null, { shallow: true });
  };
  /*
    show photospot name, and photoshots, and other info
  */
  return (
    <div
      className={`w-full h-full flex flex-col gap-4 relative ${
        selectedPhotospot !== null ? "" : "hidden"
      }`}
    >
      <Card className="border-none">
        <div className="w-full h-[400px] overflow-hidden relative">
          {topPhotoshot ? (
            <Image
              src={topPhotoshot.photo_paths ? topPhotoshot.photo_paths[0] : ""}
              alt="Image"
              className="rounded-t-md object-cover z-1"
              fill
            />
          ) : (
            <Skeleton className="bg-black/10 object-cover rounded w-full h-[400px]" />
          )}
          <Button
            onClick={closePreview}
            className="absolute top-4 right-4 p-2 z-11 "
          >
            <MdClose className="w-6 h-6 z-11 fill-white" />
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <div className="flex flex-row justify-between items-center">
              {photospot && photospot.location_name}
              {photospot && <Button onClick={visitPhotospot}>Visit</Button>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <RatingDisplay
            rating={
              photospot?.rating_average ? round(photospot.rating_average, 1) : 0
            }
            count={photospot?.rating_count ? photospot.rating_count : 0}
          />
          {photospot?.dist_meters && (
            <h1 className="text-l">
              <b>{photospot.neighborhood} </b>
              {" " + round(photospot?.dist_meters, 0) + " meters away"}
            </h1>
          )}
          {/* 
          need to get photoshot lists
          */}
          <Tabs defaultValue="photoshot" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger className="text-xl" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="text-xl" value="photoshot">
                Photos
              </TabsTrigger>
              <TabsTrigger className="text-xl" value="reviews">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="overview"
              className="w-full flex flex-col gap-6"
            >
              <Separator className="w-full" />
              {photospot && (
                <div className="flex flex-row justify-center gap-4">
                  <PhotospotDirectionsButton id={photospot.id} />
                  <SharePhotospotButton id={photospot.id} />
                  {profile && <SavePhotospotButton id={photospot.id} />}
                </div>
              )}

              <Separator className="w-full" />
              {tags && (
                <div className="flex flex-col gap-2 h-full">
                  <h1 className="font-bold">Tags:</h1>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, TAG_LIMIT).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <h1 className="text-l">
                <b>Address: </b>
                {photospot && photospot.address}
              </h1>
            </TabsContent>
            <TabsContent value="photoshot">
              <InfiniteScrollGrid
                gridData={photoshots}
                gridType={GridTypes.photoshot}
                setSize={setSize}
                size={size}
                dataLoading={photoshotsLoading}
                colCount={{ sm: 1, md: 1, lg: 1, xl: 1 }}
              />
            </TabsContent>
            <TabsContent value="reviews">
              {selectedPhotospot && (
                <ReviewGrid id={selectedPhotospot} sort="high" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        {/* {photospot && photospot.location_name} */}
      </Card>
    </div>
  );
}
