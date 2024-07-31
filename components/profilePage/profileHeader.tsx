import { fetcher } from "@/utils/common/fetcher";
import { DefaultProfile } from "@/utils/common/imageLinks";
import Image from "next/image";
import { useQueryState } from "nuqs";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import MyFollowers from "./myFollowers";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MyFollowing from "./myFollowing";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { IoMdSettings } from "react-icons/io";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SettingSection from "./settingsSection/settingSection";
export default function ProfileHeader() {
  const [profileSection, setProfileSection] = useQueryState("profileSection");
  const { data: profileInfo } = useSWR("/api/profile", fetcher);
  const { data: myFollowers } = useSWR(
    `/api/profile/user/${profileInfo?.id}/getFollowers`,
    fetcher
  );
  const { data: myFollowing } = useSWR(
    `/api/profile/user/${profileInfo?.id}/getFollowing`,
    fetcher
  );
  if (profileInfo) {
    console.log("profile", profileInfo);
  }
  //   profileInfo.bio =
  // "TEST BIO LOLOLOLOL TEST BIO LOLOLOLO TEST BIO LOLOLOLOLL TEST BIO LOLOLOLOL TEST BIO LOLOLOLOL";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center p-4 gap-8">
        <div className="w-[125px] h-[125px] rounded-full relative overflow-hidden flex-none">
          {profileInfo ? (
            <Image
              src={
                profileInfo.photo_path ? profileInfo.photo_path : DefaultProfile
              }
              alt="profile"
              fill
              className="object-cover"
            />
          ) : (
            <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
          )}
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex flex-row w-full justify-between items-center">
            <h1 className="text-xl font-semibold">{profileInfo?.username}</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <IoMdSettings className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[80vw] h-[100vh] overflow-auto">
                <SettingSection user={profileInfo} />
              </SheetContent>
            </Sheet>
            {/*  sheet here */}
          </div>
          {profileInfo?.bio && (
            <h1 className="text-md font-light">{" " + profileInfo.bio}</h1>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-center gap-8">
          <Dialog>
            <DialogTrigger>
              <h1 className="text-lg font-regular cursor-pointer p-2 text-slate-500">
                Followers {myFollowers?.length ? myFollowers.length : 0}
              </h1>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Followers</DialogTitle>
              <MyFollowers />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <h1 className="text-lg font-regular cursor-pointer p-2 text-slate-500">
                Following {myFollowing?.length ? myFollowing.length : 0}
              </h1>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Following</DialogTitle>
              <MyFollowing />
            </DialogContent>
          </Dialog>
        </div>
        <Tabs
          value={profileSection ? profileSection : "myPhotoshots"}
          onValueChange={(newTab) => setProfileSection(newTab)}
        >
          <Separator />
          <TabsList className="flex flex-row justify-between pl-8 pr-8 mt-3 mb-3">
            <TabsTrigger value="myPhotoshots">Photos</TabsTrigger>
            <TabsTrigger value="likedPhotoshots">Likes</TabsTrigger>
            <TabsTrigger value="savedPhotospots">Saved</TabsTrigger>
          </TabsList>
          <div className="flex flex-row justify-center gap-4"></div>
          <Separator />
        </Tabs>
      </div>
    </div>
  );
}
