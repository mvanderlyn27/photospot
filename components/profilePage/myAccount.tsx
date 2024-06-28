"use client"
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from 'next/image';
import { fetcher } from "@/utils/common/fetcher";

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
                        <CardTitle>My Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            <h1> {profileInfo.role}</h1>
                            <h1> {profileInfo.theme}</h1>
                        </div>
                    </CardContent>
                </Card>
            }
        </>
    )
}