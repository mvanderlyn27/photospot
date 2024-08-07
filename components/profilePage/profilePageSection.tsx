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
  const { isMd } = useBreakpoint("md");
  const { isLg } = useBreakpoint("lg");
  const [profileSection, setProfileSection] = useQueryState(
    "profileSection",
    parseAsString.withDefault(initialProfileSection)
  );
  return (
    <div className="w-full">
      {isLg && (
        <div className="flex flex-row gap-4 w-full">
          <div className="flex  flex-col">
            <ProfileLeftbar initialProfileSection={profileSection} />
          </div>
          <div className="flex-1 p-4 h-[calc(100vh-64px)] overflow-auto">
            {profileSection === "followers" && (
              <div className="flex flex-row justify-center md:pl-[10%] md:pr-[10%] lg:pl-[20%] lg:pr-[20%]">
                <div className="w-full ">
                  <MyFollowers />
                </div>
              </div>
            )}
            {profileSection === "following" && (
              <div className="flex flex-row justify-center md:pl-[10%] md:pr-[10%] lg:pl-[20%] lg:pr-[20%]">
                <div className="w-full">
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
      {!isLg && (
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
