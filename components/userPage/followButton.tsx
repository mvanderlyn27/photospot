import useSWR, { useSWRConfig } from "swr";
import { Button } from "../ui/button";
import { fetcher } from "@/utils/common/fetcher";
import { toast } from "../ui/use-toast";
import { useDebouncedCallback } from "use-debounce";

export default function FollowButton({ userId }: { userId: string }) {
  const { mutate } = useSWRConfig();
  const {
    data: following,
    mutate: updateFollower,
    isLoading: loadingFollowing,
    isValidating: validatingFollowing,
  } = useSWR(`/api/profile/user/${userId}/following`, fetcher);
  //need to fix logic
  const handleFollow = async () => {
    return fetch(`/api/profile/user/${userId}/follow`, {
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
    return fetch(`/api/profile/user/${userId}/unfollow`, {
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
      updateFollower(handleUnfollow, {
        optimisticData: false,
      });
      toast({ title: "Unfollowed" });
    } else {
      updateFollower(handleFollow, {
        optimisticData: true,
      });
      toast({ title: "followed" });
    }
  };
  const handleClickDebounced = useDebouncedCallback((e) => handleClick(e), 200);
  return (
    <>
      <Button
        disabled={loadingFollowing}
        onClick={(e) => handleClickDebounced(e)}
        variant={following ? "outline" : "default"}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </>
  );
}
