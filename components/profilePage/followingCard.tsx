"use client";
import Image from "next/image";
import { DefaultProfile } from "@/utils/common/imageLinks";
import Link from "next/link";
import { Button } from "../ui/button";
import { fetcher } from "@/utils/common/fetcher";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "../ui/use-toast";
import { useEffect, useState } from "react";
export default function FollowingCard({ user }: { user: any }) {
  const [isUser, setIsUser] = useState(false);
  const { data: profile } = useSWR(`/api/profile/`, fetcher);
  //need to check if we follow this user or not
  const { mutate } = useSWRConfig();
  const {
    data: following,
    mutate: updateFollower,
    isLoading: loadingFollowing,
  } = useSWR(`/api/profile/user/${user.id}/following`, fetcher);
  useEffect(() => {
    setIsUser(profile?.id === user.id);
  }, [profile, user]);
  const handleFollow = async () => {
    return fetch(`/api/profile/user/${user.id}/follow`, {
      method: "POST",
    }).then(async (res) => {
      if (!res.ok) {
        toast({ title: "Failed to follow :(", variant: "destructive" });
        throw new Error("Failed to follow :(");
      } else {
        return true;
      }
    });
  };
  const handleUnfollow = async () => {
    return fetch(`/api/profile/user/${user.id}/unfollow`, {
      method: "POST",
    }).then(async (res) => {
      if (!res.ok) {
        toast({ title: "Failed to unfollow :(", variant: "destructive" });
        throw new Error("Failed to unfollow :(");
      } else {
        return false;
      }
    });
  };
  const handleClick = async (e: any) => {
    e.preventDefault();
    if (following) {
      toast({ title: "Unfollowed" });
      await updateFollower(handleUnfollow, {
        optimisticData: false,
      });
    } else {
      toast({ title: "followed" });
      await updateFollower(handleFollow, {
        optimisticData: true,
      });
    }
  };
  return (
    <Link
      className="flex flex-row gap-4 p-4 items-center"
      href={`/user/${user.id}`}
    >
      {/* replace with shadcn avatar lol */}
      <div className="relative rounded-full w-12 h-12 md:w-20 md:h-20 overflow-hidden ">
        <Image
          src={user.photo_path ? user.photo_path : DefaultProfile}
          fill
          alt={user.username ? user.username : ""}
          className="object-cover"
        />
      </div>

      <div className="flex flex-row gap-4 justify-between flex-1">
        <h1 className="text-xl">{isUser ? "Your Account" : user.username}</h1>
        {!isUser && (
          <Button
            variant={following ? "outline" : "default"}
            onClick={(e) => handleClick(e)}
            disabled={loadingFollowing}
          >
            {following ? "unfollow" : "follow"}
          </Button>
        )}
      </div>
    </Link>
  );
}
