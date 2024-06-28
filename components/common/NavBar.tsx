"use client"
import Link from "next/link";
import LogoutButton from "../auth/LogoutButton";
import { Button } from '@/components/ui/button';
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";

export default function NavBar() {
    //get user logged in, render navbar
    const { data: user, isLoading: userLoading, error: userError } = useSWR("/api/profile", fetcher);
    const pathname = usePathname();
    const pathStart = pathname.split('/')[1];
    return (

        <nav className="w-full flex justify-center h-16">
            <div className="w-full  flex justify-between items-center p-3 pl-10 pr-10 text-foreground">
                <Link href="/">
                    <h3 className="text-3xl font-semibold ">PhotoSpot</h3>
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        Hey, <b>{user.username ? user.username : user.email}!</b>
                        <div className="flex jusitfy-between items-center flex-row">
                            <Link
                                href="/home"
                                className={`${pathStart === 'home' ? 'font-bold' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Home </Link>
                            <Link
                                href="/explore"
                                className={`${pathStart === 'explore' ? 'font-bold' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Explore</Link>
                            <Link
                                href="/create"
                                className={`${pathStart === 'create' ? 'font-bold' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Create</Link>
                            <Link
                                href="/profile"
                                className={`${pathStart === 'profile' ? 'font-bold' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Profile</Link>
                            <LogoutButton />
                        </div>
                    </div>
                ) : (
                    <div>

                        <Link
                            href="/login"
                            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                        >
                            <Button>Login</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}