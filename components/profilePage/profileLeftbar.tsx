"use client"
import { fetcher } from "@/utils/common/fetcher";
import { DefaultProfile } from "@/utils/common/imageLinks";
import useSWR from "swr";
import Image from 'next/image';
import Link from "next/link";
export default function ProfileLeftbar({ profileSection }: { profileSection: string }) {
    const { data: profileInfo } = useSWR("/api/profile", fetcher);
    return (
        <>
            {profileInfo && <div className="flex flex-col items-center gap-8">
                <h1 className="text-2xl font-semibold">@{profileInfo.username}</h1>
                <div className="p-16 w-[300px] h-[300px] rounded-full relative overflow-hidden">
                    <Image src={profileInfo.photo_path ? profileInfo.photo_path : DefaultProfile} alt="profile" fill className="object-cover" />
                </div>
                <p className="text-center">{profileInfo.bio}</p>
                <div className="flex flex-col gap-10">
                    <Link href="/profile/followers" >
                        <h1 className={`text-xl ${profileSection === 'followers' ? 'font-bold' : ''}`}>Followers</h1>
                    </Link>
                    <Link href="/profile/following">
                        <h1 className={`text-xl ${profileSection === 'following' ? 'font-bold' : ''}`}>Following</h1>
                    </Link>
                    <Link href="/profile/likedPhotoshots">
                        <h1 className={`text-xl ${profileSection === 'likedPhotoshots' ? 'font-bold' : ''}`}> Liked Photo Shots</h1>
                    </Link>
                    <Link href="/profile/myPhotoshots">
                        <h1 className={`text-xl ${profileSection === 'myPhotoshots' ? 'font-bold' : ''}`}>My Photoshots</h1>
                    </Link>
                    <Link href="/profile/mySettings">
                        <h1 className={`text-xl ${profileSection === 'mySettings' ? 'font-bold' : ''}`}>My Settings </h1>
                    </Link>
                </div>
            </div>
            }
        </>
    )
}