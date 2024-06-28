"use client"
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from 'next/image';
import { fetcher } from "@/utils/common/fetcher";
import EditEmailForm from "./editEmailForm";
import EditPasswordForm from "./editPasswordForm";
import SelectThemeForm from "./selectThemeForm";
import EditPrivacyForm from "./editPrivacyForm";
import DeleteAccountForm from "./deleteAccountForm";

export default function MyAccount({ user }: { user: any }) {
    /*
    //change password/email
    //delete account
    //change theme
    //change private mode
    */
    const { data: profileInfo } = useSWR("/api/profile", fetcher);
    return (
        <>
            {user &&
                <Card className="flex flex-col items-center w-[600px]">
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
                            <EditPrivacyForm profileInfo={profileInfo} />
                            {/* Delete account  */}
                            <DeleteAccountForm profileInfo={profileInfo} />
                        </div>
                    </CardContent>
                </Card>
            }
        </>
    )
}