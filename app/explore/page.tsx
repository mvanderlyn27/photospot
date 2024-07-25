import ExploreLeftBar from "@/components/explorePage/exploreLeftBar";
import ExploreMap from "@/components/explorePage/exploreMap";
import ExplorePageSection from "@/components/explorePage/explorePageSection";
import PhotospotPreview from "@/components/explorePage/photospotPreview";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/vercel/url";
import { availableParallelism } from "os";

//Want to have it so we can go to a url to specify a certain filte, ie /explore?tag=funny&selectedId=1
export default async function ExplorePage({
  searchParams,
}: {
  searchParams?: {
    selectedPhotospot?: number;
    tab?: string;
    sort?: string;
    maxDistance?: number; //in km
    minRating?: number;
    tags?: string[];
    lat?: number;
    lng?: number;
    zoom?: number;
  };
}) {
  //validate input
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("not logged in");
  }
  const { data: initialPhotospots, error } = await supabase.rpc(
    "get_all_photospots_with_lat_lng"
  );
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  let initialSelectedPhotospot = undefined;
  if (searchParams?.selectedPhotospot !== undefined) {
    const selectedId = searchParams.selectedPhotospot;
    initialSelectedPhotospot = initialPhotospots.find(
      (photospot) => photospot.id === selectedId
    );
  }
  if (searchParams && !searchParams.tab) {
    searchParams.tab = "search";
  }
  //fetch data with supabase
  return (
    <div className="w-full h-full flex flex-row overflow-hidden min-h-0 relative">
      {/* <div className="w-full flex flex-row "> */}
      <div className="h-full w-[500px]">
        <ExploreLeftBar />
      </div>
      {searchParams?.tab !== "search" && (
        <div className="absolute left-[525px] top-[25px] bottom-[25px] z-10 overflow-y-auto overflow-x-hidden w-[500px] rounded-xl">
          <PhotospotPreview />
        </div>
      )}

      <div className="h-full flex-1">
        <ExploreMap />
      </div>
    </div>
  );
}
