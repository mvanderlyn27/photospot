"use client";
import useSWR from "swr";
import SavedPhotospotResults from "./savedPhotospotResults";
import { fetcher } from "@/utils/common/fetcher";

export default function SavedTab() {
  const { data: profile } = useSWR("api/profile", fetcher);
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl p-4">Saved</h1>
      <div className="flex flex-1 min-h-0 w-full">
        <SavedPhotospotResults userId={profile?.id} />;
        {/* <PhotospotSearchResults /> */}
      </div>
    </div>
  );
}
