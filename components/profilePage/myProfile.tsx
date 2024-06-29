"use client"
import { motion } from "framer-motion";
import { fetcher } from "@/utils/common/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from 'next/image';
import useSWR from "swr";
import { DefaultProfile } from "@/utils/common/imageLinks";
import { FaEdit } from "react-icons/fa";
import EditProfilePicture from "./editProfilePicture";
import EditUsernameForm from "./editUsernameForm";
import EditBioForm from "./editBioForm";
export default function MyProfile({ user }: { user: any }) {
    /*
    want picture change opportunity
    name change
    bio 
    */

    const { data: profileInfo } = useSWR("/api/profile", fetcher);
    return (
        <>
            {profileInfo && user &&
                <Card className="flex flex-col items-center w-[600px] h-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">My Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            {/* Update picture form */}
                            <EditProfilePicture profileInfo={profileInfo} />
                            {/* Update username form */}
                            <EditUsernameForm profileInfo={profileInfo} />
                            {/* Update Bio form  */}
                            <EditBioForm profileInfo={profileInfo} />
                        </div>

                    </CardContent>
                </Card>
            }
        </>
    )
}