import UserPageSection from "@/components/userPage/userPageSection";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user && user.data.user.id === params.userId) {
    redirect("/profile");
  }
  return (
    <Suspense>
      <UserPageSection
        userId={params.userId ? params.userId : "userPhotoshots"}
      />
    </Suspense>
  );
}
