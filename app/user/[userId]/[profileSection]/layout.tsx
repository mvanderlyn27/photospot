import ProfileLeftbar from "@/components/profilePage/profileLeftbar";
import UserLeftBar from "@/components/userPage/userLeftBar";
import { DefaultProfile } from "@/utils/common/imageLinks";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/vercel/url";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { profileSection: string; userId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.userId)
    .single();
  if (profileError) {
    console.log("error", profileError);
    notFound();
  }
  if (user && profile.id === user.id) {
    redirect("/profile/myPhotoshots");
  }
  return (
    <div className="flex flex-row gap-4">
      <div className="flex md:w-1/5 flex-col">
        <UserLeftBar profileSection={params.profileSection} profile={profile} />
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
