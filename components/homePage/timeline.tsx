"use client"
import PhotospotCard from "@/components/timeline/photospotCard";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import DailyPhotoTime from "./dailyPhotoTime";
import PhotoshotTimelineGrid from "./photoshotTimelineGrid";
import PhotoshotGrid from "../photoshot/photoshotGrid";
import { TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Tabs } from "../ui/tabs";

export default function Timeline() {
    // const { data: myPhotospots, error, isLoading }: { data: Photospot[], error: any, isLoading: boolean } = useSWR('/api/photospot', fetcher);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>({ latitude: 40.74, longitude: -73.99 });
    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            })
        }
    }, []);
    // layout options:
    //  - golden hour time
    //  - pinterest like layout of photoshots
    //layout 2:
    // tab at top
    // photo near you
    // popular photospots
    // stuff you follow 
    // infinite scroll grid underneath
    //clicking into a photo brings you to the photospots page with the photoshot open?
    return (
        <div className="flex flex-col justify-center gap-4">
            {/* <DailyPhotoTime lat={location ? location.latitude : 40.73} lng={location ? location.longitude : -73.94} /> */}
            <div className="flex flex-col justify-center gap-4 p-8">            {
                // myPhotospots.map(photospot => <PhotospotCard photospot={photospot} />)
                <Tabs defaultValue="suggested">
                    <TabsList className="flex flex-row justify-center mb-8">
                        <TabsTrigger className="text-3xl" value="suggested"> For Me </TabsTrigger>
                        <TabsTrigger className="text-3xl" value="nearby"> Near Me </TabsTrigger>
                        <TabsTrigger className="text-3xl" value="popular"> Popular </TabsTrigger>
                    </TabsList>
                    <TabsContent value="nearby">
                        {location && <PhotoshotTimelineGrid photoshotPath={'/api/photoshot/timeline/nearby?lat=' + location.latitude + '&lng=' + location.longitude} />}
                    </TabsContent>
                    <TabsContent value="popular">
                        <PhotoshotTimelineGrid photoshotPath={'api/photoshot/timeline/popular'} />
                    </TabsContent>
                    <TabsContent value="suggested">
                        <PhotoshotTimelineGrid photoshotPath={'api/photoshot/timeline/suggested'} />
                    </TabsContent>
                </Tabs>
            }
            </div>

        </div>
    )
}