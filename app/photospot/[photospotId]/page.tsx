import PreviewMap from "@/components/photospotPage/previewMap";
import PhotospotInfo from "@/components/photospotPage/photospotInfo";
import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import PhotospotReviewSection from "@/components/photospotPage/photospotReviewSection";
import { PhotospotPhotoSection } from "@/components/photospotPage/photospotPhotoSection";
import { useBreakpoint } from "@/hooks/tailwind";
import PhotospotPageSection from "@/components/photospotPage/photospotPageSection";

export default async function PhotospotPage({
  params,
}: {
  params: { photospotId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <PhotospotPageSection
      user={user}
      photospotId={parseInt(params.photospotId)}
    />
  );
}
