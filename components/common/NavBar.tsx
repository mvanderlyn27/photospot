import Link from "next/link";
import LogoutButton from "../auth/LogoutButton";
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server'

export default async function NavBar() {
    //get user logged in, render navbar
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    const username = user?.user_metadata?.username
    // const pathname = usePathname()
    console.log(user);
    return (
        <nav className="w-full flex justify-center h-16">
            <div className="w-full  flex justify-between items-center p-3 pl-10 pr-10 text-foreground">
                <h3 className="text-3xl font-semibold ">PhotoSpot</h3>
                {user ? (
                    <div className="flex items-center gap-4">
                        Hey, <b>{username ? username : user.email}!</b>
                        <div className="flex jusitfy-between items-center flex-row">
                            <Link
                                href="/home"
                                className={`${false ? 'active' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Home </Link>
                            <Link
                                href="/explore"
                                className={`${false ? 'active' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Explore</Link>
                            <Link
                                href="/create"
                                className={`${false ? 'active' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Create</Link>
                            <Link
                                href="/profile"
                                className={`${false ? 'active' : ''} py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`} > Profile</Link>
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