import Image from "next/image";
import { DefaultProfile } from "@/utils/common/imageLinks";
import Link from "next/link";
import { Profile } from "@/types/photospotTypes";
export default function UserLeftBar({
  profileSection,
  profile,
}: {
  profileSection: string;
  profile: Profile;
}) {
  return (
    <>
      {profile &&
        (!profile.private_profile ? (
          <div className="flex flex-col items-center gap-8 p-8">
            <h1 className="text-2xl font-semibold">@{profile.username}</h1>
            <div className="p-16 w-[300px] h-[300px] rounded-full relative overflow-hidden">
              <Image
                src={profile.photo_path ? profile.photo_path : DefaultProfile}
                alt="profile"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center">{profile.bio}</p>
            <div className="flex flex-col gap-10">
              <Link href={`/user/${profile.id}/followers`}>
                <h1
                  className={`text-xl ${
                    profileSection === "followers" ? "font-bold" : ""
                  }`}
                >
                  Followers
                </h1>
              </Link>
              <Link href={`/user/${profile.id}/following`}>
                <h1
                  className={`text-xl ${
                    profileSection === "following" ? "font-bold" : ""
                  }`}
                >
                  Following
                </h1>
              </Link>
              <Link href={`/user/${profile.id}/usersPhotoshots`}>
                <h1
                  className={`text-xl ${
                    profileSection === "usersPhotoshots" ? "font-bold" : ""
                  }`}
                >
                  User's Photoshots
                </h1>
              </Link>
              <Link href={`/user/${profile.id}/likedPhotoshots`}>
                <h1
                  className={`text-xl ${
                    profileSection === "likedPhotoshots" ? "font-bold" : ""
                  }`}
                >
                  {" "}
                  Liked Photoshots
                </h1>
              </Link>
              <Link href={`/user/${profile.id}/savedPhotospots`}>
                <h1
                  className={`text-xl ${
                    profileSection === "savedPhotospots" ? "font-bold" : ""
                  }`}
                >
                  {" "}
                  Saved Locations
                </h1>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 p-8">
            <h1 className="text-2xl font-semibold">@{profile.username}</h1>
            <div className="p-16 w-[300px] h-[300px] rounded-full relative overflow-hidden">
              <Image
                src={profile.photo_path ? profile.photo_path : DefaultProfile}
                alt="profile"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center">{profile.bio}</p>
            <p className="text-center">Private Account</p>
          </div>
        ))}
    </>
  );
}
