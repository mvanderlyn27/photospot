import ExplorePageSection from "@/components/explorePage/explorePageSection";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/vercel/url";
import { availableParallelism } from "os";

//Want to have it so we can go to a url to specify a certain filte, ie /explore?tag=funny&selectedId=1
export default async function ExplorePage({
  searchParams,
}: {
  searchParams?: {
    photospotNameQuery?: string;
    searchMode?: string;
    tags?: string[];
    selectedPhotospotId?: string;
  };
}) {
  //validate input
  // fix query soon
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("not logged in");
  }
  const { data, error } = await supabase.from("photospots").select("*");
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  //fetch data with supabase
  const availablePhotospots = data;
  return (
    <ExplorePageSection
      searchParams={searchParams}
      availablePhotospots={availablePhotospots ? availablePhotospots : []}
    />
  );
  //   return <>test as well</>;
}
