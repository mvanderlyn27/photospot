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
import FilterTab from "./filterTab";
import SavedTab from "./savedTab";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";

export default function ExploreTabs() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(["search", "filter", "saved", ""])
  );
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState(
    "selectedPhotospot",
    parseAsInteger
  );
  const handleTabChange = (oldTab: string | null, newTab: string) => {
    console.log("oldTab", oldTab, "newTab", newTab);
    setTab(newTab);
    setSelectedPhotospot(null);
    //clear out selected photospot
    if (oldTab !== newTab) {
      if (newTab !== "filter") {
        //figure out if we want to lose the filter info when switching tabs
        console.log("removing tags");
        //clear out old tags
      }
    }
  };
  return (
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
            <PhotospotSearchForm />
          </div>
          <div className="flex flex-1 min-h-0 ">
            {/* <PhotospotSearchResults /> */}
            {selectedPhotospot && <PhotospotPreview />}
          </div>
        </TabsContent>
        <TabsContent value="filter">
          <FilterTab />
        </TabsContent>
        <TabsContent value="saved">
          <SavedTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}
