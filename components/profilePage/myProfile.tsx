"use client"
import { motion } from "framer-motion";
import { fetcher } from "@/utils/common/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from 'next/image';
import useSWR from "swr";
import { DefaultProfile } from "@/utils/common/imageLinks";
import { FaEdit } from "react-icons/fa";
import EditProfilePicture from "./editProfilePicture";
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
                <Card className="flex flex-col items-center w-[600px]">
                    <CardHeader>
                        <CardTitle className="text-2xl">My Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            {/* Update picture form */}
                            <EditProfilePicture profileInfo={profileInfo} />
                            {/* Update username form */}
                            <h1> {profileInfo.username}</h1>
                            {/* Update Bio form  */}
                            <h1> {profileInfo.bio}</h1>
                        </div>

                    </CardContent>
                </Card>
            }
        </>
    )
}