import Followers from "@/components/profilePage/myFollowers";
import Following from "@/components/profilePage/myFollowing";
import LikedPhotoshots from "@/components/profilePage/myLikedPhotoshots";
import MyPhotoshots from "@/components/profilePage/myPhotoshots";
import SavedPhotospots from "@/components/profilePage/mySavedPhotospots";
import { Skeleton } from "@/components/ui/skeleton";
import UserLeftBar from "@/components/userPage/UserLeftBar";
import UserLikedPhotoshots from "@/components/userPage/UserLikedPhotoshots";
import UserPhotoshots from "@/components/userPage/UserPhotoshots";
import UserSavedPhotospots from "@/components/userPage/userFollowers";
import UserFollowers from "@/components/userPage/userFollowers";
import UserFollowing from "@/components/userPage/userFollowing";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/vercel/url";
import { notFound } from "next/navigation";

export default async function ProfileSection({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string; profileSection: string };
}) {
  const supabase = createClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.userId)
    .single();
  if (profileError) {
    console.log("error", profileError);
    notFound();
  }
  console.log(profile);
  return (
    <div className="flex flex-row gap-4">
      <div className="flex md:w-1/5 flex-col">
        <UserLeftBar profileSection={params.profileSection} profile={profile} />
      </div>
      <div className="flex-1 p-4">
        {params.profileSection === "followers" && (
          <UserFollowers userId={profile.id} />
        )}
        {params.profileSection === "following" && (
          <UserFollowing userId={profile.id} />
        )}
        {params.profileSection === "savedPhotospots" && (
          <UserSavedPhotospots userId={profile.id} />
        )}
        {(params.profileSection === "usersPhotoshots" ||
          !params.profileSection) && <UserPhotoshots userId={profile.id} />}
        {params.profileSection === "likedPhotoshots" && (
          <UserLikedPhotoshots userId={profile.id} />
        )}
      </div>
    </div>
  );
}
