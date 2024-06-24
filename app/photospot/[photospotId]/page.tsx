import PreviewMap from "@/components/photospotPage/previewMap";
import PhotospotInfo from "@/components/photospotPage/photospotInfo";
import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import PhotospotReviewSection from "@/components/photospotPage/photospotReviewSection";
import { PhotospotPhotoSection } from "@/components/photospotPage/photospotPhotoSection";

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
    <div className="flex flex-col justify-center gap-8 w-full md:pl-5 md:pr-5 lg:pl-20 lg:pr-20">
      <div className="hidden xl:flex flex-row gap-24 w-full justify-center h-[600px] ">
        <div className="flex-1 ">
          {user && <PhotospotInfo user={user} id={parseInt(params.photospotId)} />}
        </div>
        <div className="flex-1 ">
          <PreviewMap id={parseInt(params.photospotId)} />
        </div>
      </div>
      <div className="flex flex-col xl:hidden gap-4">

        {user && <PhotospotInfo user={user} id={parseInt(params.photospotId)} />}
        <div className="h-[600px]">
          <PreviewMap id={parseInt(params.photospotId)} />
        </div>
      </div>
      <Tabs defaultValue="photos" className="w-full ">
        <TabsList className="w-full justify-center gap-24">
          <TabsTrigger value="photos" className="text-3xl">
            Photos
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-3xl">
            Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos" className="flex flex-col gap-4">
          <PhotospotPhotoSection id={parseInt(params.photospotId)} />
        </TabsContent>
        <TabsContent value="reviews">
          <PhotospotReviewSection id={parseInt(params.photospotId)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
