"use client";
import Image from "next/image";
import { DefaultProfile } from "@/utils/common/imageLinks";
import Link from "next/link";
import { Button } from "../ui/button";
import { fetcher } from "@/utils/common/fetcher";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "../ui/use-toast";
export default function FollowingCard({ user }: { user: any }) {
  //need to check if we follow this user or not
  const { mutate } = useSWRConfig();
  const {
    data: following,
    mutate: updateFollower,
    isLoading: loadingFollowing,
  } = useSWR(`/api/profile/user/${user.id}/following`, fetcher);

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (following) {
      fetch(`/api/profile/user/${user.id}/unfollow`, {
        method: "POST",
      }).then(async (res) => {
        if (!res.ok) {
          toast({ title: "Failed to unfollow", variant: "destructive" });
        } else {
          //need to fix logic here
          await updateFollower(false);
          await mutate(`/api/profile/user/${user.id}/getFollowing`);
          toast({ title: "Unfollowed" });
        }
      });
    } else {
      fetch(`/api/profile/user/${user.id}/follow`, {
        method: "POST",
      }).then(async (res) => {
        if (!res.ok) {
          toast({ title: "Failed to follow :(", variant: "destructive" });
        } else {
          await mutate(`/api/profile/user/${user.id}/getFollowing`);
          toast({ title: "Followed" });
        }
      });
    }
  };
  return (
    <Link className="flex flex-row gap-4 p-4" href={`/user/${user.id}`}>
      {/* replace with shadcn avatar lol */}
      <div className="relative rounded-full w-20 h-20 overflow-hidden m-auto">
        <Image
          src={user.photo_path ? user.photo_path : DefaultProfile}
          fill
          alt={user.username ? user.username : ""}
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-xl">Username: {user.username}</h1>
        <Button
          variant={following ? "outline" : "default"}
          onClick={(e) => handleClick(e)}
        >
          {following ? "unfollow" : "follow"}
        </Button>
      </div>
    </Link>
  );
}
