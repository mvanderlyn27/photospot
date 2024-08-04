"use client";
import { parseAsArrayOf, parseAsFloat, parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { Card } from "../ui/card";
import FilterTab from "./filterTab";
import PhotospotSearchForm from "./photospotSearchForm";
import { Photospot } from "@/types/photospotTypes";
import PhotospotPreview from "./photospotPreview";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import FilterSearchForm from "./filterSearchForm";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function ExploreTopBar({
  photospots,
  selectedPhotospotInfo,
  photospotsLoading,
  accordionOpen,
  setAccordionOpen,
}: {
  photospots: Photospot[][] | null;
  selectedPhotospotInfo: Photospot | null;
  photospotsLoading: boolean;
  accordionOpen: boolean;
  setAccordionOpen: any;
}) {
  const [tab, setTab] = useQueryState("tab", parseAsStringLiteral(["search", "filter", "saved"]));
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState("selectedPhotospot", parseAsInteger);
  const [maxDistance, setMaxDistance] = useQueryState("maxDistance", parseAsFloat);
  const [sort, setSort] = useQueryState("sort", parseAsStringLiteral(["top", "nearby", "new", ""]).withDefault(""));
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
    <Card className="bg-background flex flex-col rounded-tl-none rounded-tr-none">
      <Tabs
        defaultValue="tab"
        value={tab ? tab : "search"}
        onValueChange={(newTab) => handleTabChange(tab, newTab)}
        className="w-full p-2 pl-4 pr-4">
        <TabsList className="w-full ">
          <TabsTrigger value="search" className="text-xl">
            Search
          </TabsTrigger>
          <TabsTrigger value="filter" className="text-xl">
            Explore
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-xl">
            Saved
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {tab === "search" && (
        <>
          <div className="flex flex-none">
            <PhotospotSearchForm photospots={photospots} photospotsLoading={photospotsLoading} />
          </div>
        </>
      )}

      {tab === "filter" && (
        <Accordion
          onValueChange={(val) => setAccordionOpen(val === "item-1" ? true : false)}
          type="single"
          collapsible
          value={accordionOpen ? "item-1" : ""}
          className="flex flex-none w-full p-4 pt-0">
          <AccordionItem value="item-1" className="w-full ">
            <AccordionTrigger>Current Search</AccordionTrigger>
            <AccordionContent>
              <FilterSearchForm />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}
