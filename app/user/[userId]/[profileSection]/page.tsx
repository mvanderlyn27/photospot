import Followers from "@/components/profilePage/myFollowers";
import Following from "@/components/profilePage/myFollowing";
import LikedPhotoshots from "@/components/profilePage/myLikedPhotoshots";
import MyPhotoshots from "@/components/profilePage/myPhotoshots";
import SavedPhotospots from "@/components/profilePage/mySavedPhotospots";
import { Skeleton } from "@/components/ui/skeleton";
import UserLeftBar from "@/components/userPage/userLeftBar";
import UserLikedPhotoshots from "@/components/userPage/userLikedPhotoshots";
import UserPhotoshots from "@/components/userPage/userPhotoshots";
import UserSavedPhotospots from "@/components/userPage/userSavedPhotospots";
import UserFollowers from "@/components/userPage/userFollowers";
import UserFollowing from "@/components/userPage/userFollowing";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/vercel/url";
import { notFound, redirect } from "next/navigation";

export default async function ProfileSection({
  params,
}: {
  children: React.ReactNode;
  params: { userId: string; profileSection: string };
}) {
  return (
    <div className="flex-1 p-4">
      {params.profileSection === "followers" && (
        <UserFollowers userId={params.userId} />
      )}
      {params.profileSection === "following" && (
        <UserFollowing userId={params.userId} />
      )}
      {params.profileSection === "savedPhotospots" && (
        <UserSavedPhotospots userId={params.userId} />
      )}
      {(params.profileSection === "usersPhotoshots" ||
        !params.profileSection) && <UserPhotoshots userId={params.userId} />}
      {params.profileSection === "likedPhotoshots" && (
        <UserLikedPhotoshots userId={params.userId} />
      )}
    </div>
  );
}
