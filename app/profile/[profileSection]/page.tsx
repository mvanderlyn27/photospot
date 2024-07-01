import MyPhotoshots from "@/components/profilePage/myPhotoshots";
import MySettings from "@/components/profilePage/mySettings";
import { Skeleton } from "@/components/ui/skeleton";
import MyFollowers from "@/components/profilePage/myFollowers";
import MyFollowing from "@/components/profilePage/myFollowing";
import MySavedPhotospots from "@/components/profilePage/mySavedPhotospots";
import MyLikedPhotoshots from "@/components/profilePage/myLikedPhotoshots";
import { notFound, redirect } from "next/navigation";

export default function ProfileSection({
  params,
}: {
  params: { profileSection: string };
}) {
  const routes = [
    "followers",
    "following",
    "savedPhotospots",
    "myPhotoshots",
    "likedPhotoshots",
    "mySettings",
  ];
  if (
    params === undefined ||
    routes.includes(params.profileSection) === false
  ) {
    notFound();
  }
  return (
    <>
      {params.profileSection === "followers" && <MyFollowers />}
      {params.profileSection === "following" && <MyFollowing />}
      {params.profileSection === "savedPhotospots" && <MySavedPhotospots />}
      {(params.profileSection === "myPhotoshots" || !params.profileSection) && (
        <MyPhotoshots />
      )}
      {params.profileSection === "likedPhotoshots" && <MyLikedPhotoshots />}
      {params.profileSection === "mySettings" && <MySettings />}
    </>
  );
}
