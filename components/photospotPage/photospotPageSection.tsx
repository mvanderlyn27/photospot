"use client";
import { useBreakpoint } from "@/hooks/tailwind";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PhotospotInfo from "./photospotInfo";
import { PhotospotPhotoSection } from "./photospotPhotoSection";
import PhotospotReviewSection from "./photospotReviewSection";
import PreviewMap from "./previewMap";

export default function PhotospotPageSection({
  user,
  photospotId,
}: {
  user: any;
  photospotId: number;
}) {
  const { isSm } = useBreakpoint("sm");
  return (
    <>
      <div
        className={`${
          !isSm ? "hidden" : "flex"
        } flex-col justify-center gap-8 w-full md:pl-5 md:pr-5 lg:pl-20 lg:pr-20`}
      >
        <div className="hidden xl:flex flex-row gap-24 w-full justify-center h-[600px] ">
          <div className="flex-1 ">
            {user && <PhotospotInfo user={user} id={photospotId} />}
          </div>
          <div className="flex-1 ">
            <PreviewMap id={photospotId} />
          </div>
        </div>
        <div className="flex flex-col xl:hidden gap-4">
          {user && <PhotospotInfo user={user} id={photospotId} />}
          <div className="h-[600px]">
            <PreviewMap id={photospotId} />
          </div>
        </div>
        <Tabs defaultValue="photos" className="w-full ">
          <TabsList className="w-full justify-center gap-24">
            <TabsTrigger value="photos" className="text-3xl">
              Photos
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-3xl">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="photos" className="flex flex-col gap-4">
            <PhotospotPhotoSection id={photospotId} />
          </TabsContent>
          <TabsContent value="reviews">
            <PhotospotReviewSection id={photospotId} />
          </TabsContent>
        </Tabs>
      </div>
      <div className={`${isSm ? "hidden" : "flex"} flex-col justify-center `}>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full justify-center gap-8">
            <TabsTrigger value="info" className="text-2xl">
              Photospot Info
            </TabsTrigger>
            <TabsTrigger value="map" className="text-2xl">
              Map View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="flex flex-col gap-4">
            {user && <PhotospotInfo user={user} id={photospotId} />}
          </TabsContent>
          <TabsContent value="map" className="flex-1">
            <div className="h-[400px] m-4">
              <PreviewMap id={photospotId} />
            </div>
          </TabsContent>
        </Tabs>
        <Tabs defaultValue="photos" className="w-full ">
          <TabsList className="w-full justify-center gap-8">
            <TabsTrigger value="photos" className="text-2xl">
              Photos
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-2xl">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="photos" className="flex flex-col gap-4 p-4">
            <PhotospotPhotoSection id={photospotId} />
          </TabsContent>
          <TabsContent value="reviews">
            <PhotospotReviewSection id={photospotId} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
