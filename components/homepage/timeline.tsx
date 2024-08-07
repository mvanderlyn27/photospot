import { TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Tabs } from "../ui/tabs";
import NearbyPhotoshotTimelineContent from "./nearbyPhotoshotTimelineContent";
import PopularPhotoshotTimelineContent from "./popularPhotoshotTimelineContent";
import SuggestedPhotoshotTimelineContent from "./suggestedPhotoshotTimelineContent";

export default function Timeline() {
  // const { data: myPhotospots, error, isLoading }: { data: Photospot[], error: any, isLoading: boolean } = useSWR('/api/photospot', fetcher);
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
    <div className="flex flex-col justify-center gap-4 p-8">
      {
        // myPhotospots.map(photospot => <PhotospotCard photospot={photospot} />)
        <Tabs defaultValue="suggested">
          <TabsList className="w-full flex flex-row justify-center md:mb-8">
            <TabsTrigger className="text-xl md:text-3xl" value="suggested">
              Your Feed
            </TabsTrigger>
            <TabsTrigger className="text-xl md:text-3xl" value="nearby">
              Nearby
            </TabsTrigger>
            <TabsTrigger className="text-xl md:text-3xl" value="popular">
              Popular
            </TabsTrigger>
          </TabsList>
          <TabsContent value="nearby">
            <NearbyPhotoshotTimelineContent />
          </TabsContent>
          <TabsContent value="popular">
            <PopularPhotoshotTimelineContent />
          </TabsContent>
          <TabsContent value="suggested">
            <SuggestedPhotoshotTimelineContent />
          </TabsContent>
        </Tabs>
      }
    </div>
  );
}
