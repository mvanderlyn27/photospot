"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import ExploreTabs from "./exploreTabs";
import PhotospotSearchResults from "./photospotSearchResults";
import { Button } from "../ui/button";
// import { useSearchParams } from "next/navigation";
export default function ExploreLeftBar() {
  //   const searchParams = useSearchParams();
  //   const tab = searchParams.get("tab") ? searchParams.get("tab") : "";
  return (
    <div className="p-4 gap-4 w-full h-full min-h-0 overflow-hidden">
      {/* <Input placeholder="Search" /> */}
      <ExploreTabs />
      {/* <PhotospotPreview /> */}
    </div>
  );
}
