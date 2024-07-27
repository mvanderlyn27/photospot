"use client";
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import PhotospotSearchResults from "./photospotSearchResults";
import { Button } from "../ui/button";
import FilterTab from "./filterTab";
import PhotospotPreview from "./photospotPreview";
import PhotospotSearchForm from "./photospotSearchForm";
import SavedTab from "./savedTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Photospot } from "@/types/photospotTypes";
// import { useSearchParams } from "next/navigation";
export default function ExploreLeftBar({
  photospots,
  photospotsLoading,
  selectedPhotospotInfo,
  setSize,
}: {
  photospots: Photospot[][] | null;
  photospotsLoading: boolean;
  selectedPhotospotInfo: Photospot | null;
  setSize: any;
}) {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(["search", "filter", "saved"])
  );
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState(
    "selectedPhotospot",
    parseAsInteger
  );
  const [maxDistance, setMaxDistance] = useQueryState(
    "maxDistance",
    parseAsFloat
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(["top", "nearby", "new", ""]).withDefault("")
  );
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsInteger));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat);
  const handleTabChange = (oldTab: string | null, newTab: string) => {
    console.log("oldTab", oldTab, "newTab", newTab);
    setTab(newTab);
    setSelectedPhotospot(null);
    //clear out selected photospot
    if (oldTab !== newTab) {
      if (newTab !== "filter") {
        //figure out if we want to lose the filter info when switching tabs
        setMinRating(null);
        setMaxDistance(null);
        setSort(null);
        setTags(null);
        console.log("removing tags");
      }
    }
  };
  return (
    <div className="p-4 gap-4 w-full h-full min-h-0 overflow-hidden">
      {/* <Input placeholder="Search" /> */}
      <Tabs
        value={tab ? tab : "search"}
        onValueChange={(newTab) => handleTabChange(tab, newTab)}
        className="w-full h-full flex flex-col "
      >
        <div className="w-full flex flex-none p-4">
          <TabsList>
            <TabsTrigger className="text-xl" value="search">
              Location Search
            </TabsTrigger>
            <TabsTrigger className="text-xl" value="filter">
              Filter Search
            </TabsTrigger>
            <TabsTrigger className="text-xl" value="saved">
              Saved
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex flex-1 flex-col min-h-0 overflow-y-auto overflow-x-hidden">
          <TabsContent value="search">
            <div className="flex flex-none">
              <PhotospotSearchForm
                photospots={photospots}
                photospotsLoading={photospotsLoading}
              />
            </div>
            <div className="flex flex-1 min-h-0 ">
              {/* <PhotospotSearchResults /> */}
              {selectedPhotospot && selectedPhotospotInfo && (
                <PhotospotPreview photospotInfo={selectedPhotospotInfo} />
              )}
            </div>
          </TabsContent>
          <TabsContent value="filter">
            <FilterTab
              photospots={photospots}
              setSize={setSize}
              photospotsLoading={photospotsLoading}
            />
          </TabsContent>
          <TabsContent value="saved">
            <SavedTab
              photospots={photospots}
              setSize={setSize}
              photospotsLoading={photospotsLoading}
            />
          </TabsContent>
        </div>
      </Tabs>
      {/* <PhotospotPreview /> */}
    </div>
  );
}
