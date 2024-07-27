import LandingPageSection from "@/components/landingPage/landingPageSection";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <LandingPageSection />;
}
