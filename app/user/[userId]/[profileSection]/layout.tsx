"use client"
import ProfileLeftbar from "@/components/profilePage/profileLeftbar";
import { fetcher } from "@/utils/common/fetcher";
import { DefaultProfile } from "@/utils/common/imageLinks"
import { getURL } from "@/utils/vercel/url";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

export default async function Layout({ children, params }: { children: React.ReactNode, params: { userId: string, profileSection: string } }) {
    const { data: profileInfo } = useSWR(`/api/profile/user/${params.userId}`, fetcher);
    return (

        <div className="flex flex-row gap-4">
            <div className="flex md:w-1/5 flex-col">
                <ProfileLeftbar profileSection={params.profileSection} />
            </div>
            <div className="flex-1 p-4">
                {children}
            </div>
        </div>

    )
}