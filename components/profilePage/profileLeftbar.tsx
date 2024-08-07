"use client";
import { fetcher } from "@/utils/common/fetcher";
import { DefaultProfile } from "@/utils/common/imageLinks";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
export default function ProfileLeftbar({
  initialProfileSection,
}: {
  initialProfileSection: string;
}) {
  const [profileSection, setProfileSection] = useQueryState(
    "profileSection",
    parseAsString.withDefault(initialProfileSection)
  );
  const { data: profileInfo } = useSWR("/api/profile", fetcher);
  return (
    <>
      {profileInfo && (
        <div className="flex flex-col items-center gap-8 p-8 h-full">
          <h1 className="text-2xl font-semibold">@{profileInfo.username}</h1>
          <div className="p-16 w-[300px] h-[300px] rounded-full relative overflow-hidden">
            <Image
              src={
                profileInfo.photo_path ? profileInfo.photo_path : DefaultProfile
              }
              alt="profile"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-center">{profileInfo.bio}</p>
          <div className="flex flex-col gap-10">
            <h1
              className={`text-xl cursor-pointer ${
                profileSection === "followers" ? "font-bold" : ""
              }`}
              onClick={() => setProfileSection("followers")}
            >
              Followers
            </h1>
            <h1
              className={`text-xl cursor-pointer ${
                profileSection === "following" ? "font-bold" : ""
              }`}
              onClick={() => setProfileSection("following")}
            >
              Following
            </h1>
            <h1
              className={`text-xl cursor-pointer ${
                profileSection === "myPhotoshots" ? "font-bold" : ""
              }`}
              onClick={() => setProfileSection("myPhotoshots")}
            >
              My Photoshots
            </h1>
            <h1
              className={`text-xl cursor-pointer ${
                profileSection === "likedPhotoshots" ? "font-bold" : ""
              }`}
              onClick={() => setProfileSection("likedPhotoshots")}
            >
              Liked Photo Shots
            </h1>
            <h1
              className={`text-xl cursor-pointer ${
                profileSection === "savedPhotospots" ? "font-bold" : ""
              }`}
              onClick={() => setProfileSection("savedPhotospots")}
            >
              Saved Locations
            </h1>
            <h1
              className={`text-xl cursor-pointer ${
                profileSection === "mySettings" ? "font-bold" : ""
              }`}
              onClick={() => setProfileSection("mySettings")}
            >
              My Settings{" "}
            </h1>
          </div>
        </div>
      )}
    </>
  );
}
