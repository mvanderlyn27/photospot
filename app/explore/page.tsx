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

  let initialPhotospots = [];
  const { data: photospots, error: photospotsError } = await supabase
    .rpc("search_photospots")
    .order("rating_average", { ascending: false });
  // .limit(20);
  if (photospotsError) {
    console.log(photospotsError);
  }
  //fetch data with supabase
  //create a client comp that controls all search data
  return (
    <div className="w-full h-full flex flex-row overflow-hidden min-h-0 relative">
      <ExplorePageSection
        userId={user.data.user.id}
        initialPhotospots={photospots}
      />
    </div>
  );
}
