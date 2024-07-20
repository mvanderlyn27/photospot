"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FilterSearchForm from "./filterSearchForm";
import PhotospotSearchForm from "./photospotSearchForm";
import PhotospotSearchResults from "./photospotSearchResults";
import PhotospotPreview from "./photospotPreview";
import SavedPhotospotResults from "./savedPhotospotResults";

export default function ExploreTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const tabRaw = params.get("tab");
  const tab = tabRaw ? tabRaw : "search";
  const selectedPhotospotRaw = params.get("selectedPhotospot");
  const selectedPhotospot = selectedPhotospotRaw
    ? parseInt(selectedPhotospotRaw)
    : undefined;
  const handleTabChange = (oldTab: string, newTab: string) => {
    console.log("oldTab", oldTab, "newTab", newTab);
    params.set("tab", newTab);
    if (oldTab !== newTab) {
      params.delete("selectedPhotospot");
      if (newTab !== "filter") {
        //figure out if we want to lose the filter info when switching tabs
        console.log("removing tags");
        params.delete("tags");
        params.delete("sort");
        params.delete("maxDistance");
        params.delete("minRating");
      }
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Tabs
      value={tab}
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
            <PhotospotSearchForm />
          </div>
          <div className="flex flex-1 min-h-0 ">
            {/* <PhotospotSearchResults /> */}
            {selectedPhotospot && <PhotospotPreview />}
          </div>
        </TabsContent>
        <TabsContent value="filter">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="flex flex-none w-full p-4"
          >
            <AccordionItem value="item-1" className="w-full ">
              <AccordionTrigger>Current Search</AccordionTrigger>
              <AccordionContent>
                <FilterSearchForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex flex-1 min-h-0">
            <PhotospotSearchResults />
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <SavedPhotospotResults />
        </TabsContent>
      </div>
    </Tabs>
  );
}
