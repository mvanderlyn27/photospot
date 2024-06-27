import ProfileLeftbar from "@/components/profilePage/profileLeftbar";
import { DefaultProfile } from "@/utils/common/imageLinks"
import { getURL } from "@/utils/vercel/url";
import Image from "next/image";
import Link from "next/link";

export default async function Layout({ children, params }: { children: React.ReactNode, params: { profileSection: string } }) {

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