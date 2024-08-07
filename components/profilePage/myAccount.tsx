"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { fetcher } from "@/utils/common/fetcher";
import EditEmailForm from "./settingsSection/editEmailForm";
import EditPasswordForm from "./settingsSection/editPasswordForm";
import SelectThemeForm from "./settingsSection/selectThemeForm";
import EditPrivacyForm from "./settingsSection/editPrivacyForm";
import DeleteAccountForm from "./settingsSection/deleteAccountForm";
import { useBreakpoint } from "@/hooks/tailwind";

export default function MyAccount({ user }: { user: any }) {
  /*
    //change password/email
    //delete account
    //change theme
    //change private mode
    */
  const { data: profileInfo } = useSWR("/api/profile", fetcher);
  const { isSm } = useBreakpoint("sm");
  return (
    <>
      {user && isSm && (
        <Card className="flex flex-col items-center md:w-[600px] h-full">
          <CardHeader>
            <CardTitle className="text-2xl">My Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              {/* <h1> {profileInfo?.user_role}</h1> */}
              {/* Update email */}
              <EditEmailForm profileInfo={profileInfo} />
              {/* Update password */}
              <EditPasswordForm profileInfo={profileInfo} />
              {/* Update theme */}
              <SelectThemeForm profileInfo={profileInfo} />
              {/* Update private*/}
              {/* <EditPrivacyForm profileInfo={profileInfo} /> */}
              {/* Delete account  */}
              <DeleteAccountForm profileInfo={profileInfo} />
            </div>
          </CardContent>
        </Card>
      )}
      {user && !isSm && (
        <div className="flex flex-col items-center gap-2 h-full w-full">
          <CardTitle className="text-2xl">My Account</CardTitle>
          <div className="flex flex-col">
            {/* <h1> {profileInfo?.user_role}</h1> */}
            {/* Update email */}
            <EditEmailForm profileInfo={profileInfo} />
            {/* Update password */}
            <EditPasswordForm profileInfo={profileInfo} />
            {/* Update theme */}
            <SelectThemeForm profileInfo={profileInfo} />
            {/* Update private*/}
            {/* <EditPrivacyForm profileInfo={profileInfo} /> */}
            {/* Delete account  */}
            <DeleteAccountForm profileInfo={profileInfo} />
          </div>
        </div>
      )}
    </>
  );
}
