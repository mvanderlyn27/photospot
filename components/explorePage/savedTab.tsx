"use client";
import useSWR from "swr";
import SavedPhotospotResults from "./savedPhotospotResults";
import { fetcher } from "@/utils/common/fetcher";
import { Photospot } from "@/types/photospotTypes";

export default function SavedTab({
  photospots,
  photospotsLoading,
  setSize,
}: {
  photospots: Photospot[][] | null;
  photospotsLoading: boolean;
  setSize: any;
}) {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl p-4">Saved</h1>
      <div className="flex flex-1 min-h-0 w-full">
        <SavedPhotospotResults
          photospots={photospots ? photospots : undefined}
          setSize={setSize}
          photospotsLoading={photospotsLoading}
        />
      </div>
    </div>
  );
}
