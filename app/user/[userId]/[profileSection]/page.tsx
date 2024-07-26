import UserLikedPhotoshots from "@/components/userPage/userLikedPhotoshots";
import UserPhotoshots from "@/components/userPage/userPhotoshots";
import UserSavedPhotospots from "@/components/userPage/userSavedPhotospots";
import UserFollowers from "@/components/userPage/userFollowers";
import UserFollowing from "@/components/userPage/userFollowing";

export default function ProfileSection({
  params,
}: {
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
