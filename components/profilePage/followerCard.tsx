"use client";
import Image from "next/image";
import { DefaultProfile } from "@/utils/common/imageLinks";
import Link from "next/link";
import { Button } from "../ui/button";
import { fetcher } from "@/utils/common/fetcher";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "../ui/use-toast";
import { useEffect, useState } from "react";
export default function FollowerCard({ user }: { user: any }) {
  const [isUser, setIsUser] = useState(false);
  const { data: profile } = useSWR(`/api/profile/`, fetcher);
  const { mutate, cache } = useSWRConfig();
  //need to check if we follow this user or not
  const {
    data: follower,
    mutate: updateFollowing,
    isLoading: loadingFollower,
  } = useSWR(`/api/profile/user/${user.id}/follower`, fetcher);
  useEffect(() => {
    setIsUser(profile?.id === user.id);
  }, [profile, user]);
  //probably want to figure out which caches to reset, and how to do it
  //for this one we want instant update
  const handleRemoveFollower = async () => {
    return fetch(`/api/profile/user/${user.id}/removeFollower`, {
      method: "POST",
    }).then(async (res) => {
      if (!res.ok) {
        toast({
          title: "Failed to remove follower :(",
          variant: "destructive",
        });
        throw new Error("Failed to remove follower:(");
      } else {
        return false;
      }
    });
  };
  const handleClick = async (e: any) => {
    e.preventDefault();
    toast({ title: "Removed Follower" });
    await updateFollowing(handleRemoveFollower, {
      optimisticData: false,
    });
    Array.from(cache.keys()).forEach((key) => {
      if (
        key.includes(`/api/profile/user/${profile.id}/getFollowers?`) ||
        key.includes(`/api/profile/user/${user.id}/getFollowing?`)
      ) {
        mutate(key); // With this you can revalidate whatever the key is. (with @, $inf$ or whatever)
      }
    });
  };
  return (
    <Link
      className="flex flex-row gap-4 p-4 items-center"
      href={`/user/${user.id}`}
    >
      {/* replace with shadcn avatar lol */}
      <div className="relative rounded-full w-20 h-20 overflow-hidden">
        <Image
          src={user.photo_path ? user.photo_path : DefaultProfile}
          fill
          alt={user.username ? user.username : ""}
          className="object-cover"
        />
      </div>

      <div className="flex flex-row gap-4 justify-between flex-1">
        <h1 className="text-xl">{user.username}</h1>
        {follower && !isUser && (
          <Button
            variant="outline"
            onClick={(e) => handleClick(e)}
            disabled={loadingFollower}
          >
            Remove Follower
          </Button>
        )}
      </div>
    </Link>
  );
}
