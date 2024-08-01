"use client";
import ProfileLeftbar from "./profileLeftbar";
import MyFollowers from "./myFollowers";
import MyFollowing from "./myFollowing";
import MyLikedPhotoshots from "./myLikedPhotoshots";
import MyPhotoshots from "./myPhotoshots";
import MySavedPhotospots from "./mySavedPhotospots";
import MySettings from "./mySettings";
import { useBreakpoint } from "@/hooks/tailwind";
import { parseAsString, useQueryState } from "nuqs";
import Image from "next/image";
import ProfileHeader from "./profileHeader";
export default function ProfilePageSection({
  initialProfileSection,
}: {
  initialProfileSection: string;
}) {
  const { isSm } = useBreakpoint("sm");
  const [profileSection, setProfileSection] = useQueryState(
    "profileSection",
    parseAsString.withDefault(initialProfileSection)
  );
  return (
    <div className="w-full">
      {isSm && (
        <div className="flex flex-row gap-4 w-full">
          <div className="flex md:w-1/5 flex-col">
            <ProfileLeftbar initialProfileSection={profileSection} />
          </div>
          <div className="flex-1 p-4 h-[calc(100vh-64px)] overflow-auto">
            {profileSection === "followers" && (
              <div className="flex flex-row justify-center">
                <div className="w-[40%]">
                  <MyFollowers />
                </div>
              </div>
            )}
            {profileSection === "following" && (
              <div className="flex flex-row justify-center">
                <div className="w-[40%]">
                  <MyFollowing />
                </div>
              </div>
            )}
            {profileSection === "savedPhotospots" && <MySavedPhotospots />}
            {(profileSection === "myPhotoshots" || !profileSection) && (
              <MyPhotoshots />
            )}
            {profileSection === "likedPhotoshots" && <MyLikedPhotoshots />}
            {profileSection === "mySettings" && <MySettings />}
          </div>
        </div>
      )}
      {!isSm && (
        <div className="flex flex-col w-full">
          <ProfileHeader />
          <div className="p-4">
            {profileSection === "savedPhotospots" && <MySavedPhotospots />}
            {(profileSection === "myPhotoshots" || !profileSection) && (
              <MyPhotoshots />
            )}
            {profileSection === "likedPhotoshots" && <MyLikedPhotoshots />}
          </div>
        </div>
      )}
    </div>
  );
}
