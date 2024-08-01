"use client";

import { useQueryState } from "nuqs";
import UserFollowers from "./userFollowers";
import UserFollowing from "./userFollowing";
import UserLeftBar from "./userLeftBar";
import UserLikedPhotoshots from "./userLikedPhotoshots";
import UserSavedPhotospots from "./userSavedPhotospots";
import { useBreakpoint } from "@/hooks/tailwind";
import UserPhotoshots from "./userPhotoshots";
import UserProfileHeader from "./userProfileHeader";
import { Card, CardTitle } from "../ui/card";

export default function UserPageSection({ userId }: { userId: string }) {
  const { isMd } = useBreakpoint("md");
  const [profileSection, setProfileSection] = useQueryState("profileSection");
  return (
    <div className="w-full">
      {isMd && (
        <div className="flex flex-row gap-4 w-full">
          <div className="flex  flex-col">
            <UserLeftBar userId={userId} />
          </div>
          <div className="flex-1 p-4 h-[calc(100vh-64px)] overflow-auto">
            {profileSection === "followers" && (
              <div className="flex flex-row justify-center">
                <div className="w-[40%]">
                  <UserFollowers userId={userId} />
                </div>
              </div>
            )}
            {profileSection === "following" && (
              <div className="flex flex-row justify-center">
                <div className="w-[40%]">
                  <UserFollowing userId={userId} />
                </div>
              </div>
            )}
            {profileSection === "savedPhotospots" && (
              <UserSavedPhotospots userId={userId} />
            )}
            {(profileSection === "likedPhotoshots" || !profileSection) && (
              <UserLikedPhotoshots userId={userId} />
            )}
            {profileSection === "userPhotoshots" && (
              <UserPhotoshots userId={userId} />
            )}
          </div>
        </div>
      )}
      {!isMd && (
        <div className="flex flex-col w-full">
          <UserProfileHeader userId={userId} />
          <div className="p-4">
            {profileSection === "savedPhotospots" && (
              <UserSavedPhotospots userId={userId} />
            )}
            {(profileSection === "userPhotoshots" || !profileSection) && (
              <UserPhotoshots userId={userId} />
            )}
            {profileSection === "likedPhotoshots" && (
              <UserLikedPhotoshots userId={userId} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
