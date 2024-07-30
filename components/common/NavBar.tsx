"use client";
import Link from "next/link";
import LogoutButton from "../auth/LogoutButton";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useBreakpoint } from "@/hooks/tailwind";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IoMenuOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoHome } from "react-icons/io5";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
export default function NavBar() {
  const { setTheme } = useTheme();
  //get user logged in, render navbar
  const small = useBreakpoint("sm");
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useSWR("/api/profile", fetcher);
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    }
  }, [user?.theme]);
  const pathname = usePathname();
  const pathStart = pathname.split("/")[1];
  return (
    <nav className="w-full max-w-screen flex justify-center h-16 z-50">
      <div className="w-full  flex justify-between items-center p-3 lg:pl-10 lg:pr-10 text-foreground">
        <Link href={user ? "/home" : "/"}>
          <h3 className="text-3xl font-semibold ">PhotoSpot</h3>
        </Link>

        {user && small.isSm && (
          <div className="flex items-center gap-4">
            Hey, <b>{user.username ? user.username : user.email}!</b>
            <div className="flex jusitfy-between items-center flex-row">
              <Link
                href="/home"
                className={`${
                  pathStart === "home" ? "font-bold" : ""
                } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
              >
                Home
              </Link>
              <Link
                href="/explore"
                className={`${
                  pathStart === "explore" ? "font-bold" : ""
                } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
              >
                Explore
              </Link>
              <Link
                href="/create"
                className={`${
                  pathStart === "create" ? "font-bold" : ""
                } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
              >
                Create
              </Link>
              <Link
                href="/user"
                className={`${
                  pathStart === "user" ? "font-bold" : ""
                } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
              >
                Users
              </Link>
              <Link
                href="/profile"
                className={`${
                  pathStart === "profile" ? "font-bold" : ""
                } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
              >
                Profile
              </Link>
              <LogoutButton />
            </div>
          </div>
        )}
        {!user && !userLoading && (
          <div>
            <Link
              href="/login"
              className="py-2 px-3 flex cursor-pointer rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >
              <Button>Login</Button>
            </Link>
          </div>
        )}
        {user && !small.isSm && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <IoMenuOutline className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 color">
                <Link
                  href="/home"
                  className={`${
                    pathStart === "home" ? "font-bold" : ""
                  } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <IoHome className="mr-2 h-6 w-6" />
                    <span className="text-lg">Home</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link
                  href="/explore"
                  className={`${
                    pathStart === "explore" ? "font-bold" : ""
                  } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <FaMapMarkedAlt className="mr-2 h-6 w-6" />
                    <span className="text-lg">Explore</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link
                  href="/create"
                  className={`${
                    pathStart === "create" ? "font-bold" : ""
                  } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <MdAddAPhoto className="mr-2 h-6 w-6" />
                    <span className="text-lg">Create</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link
                  href="/user"
                  className={`${
                    pathStart === "user" ? "font-bold" : ""
                  } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <FaUsers className="mr-2 h-6 w-6" />
                    <span className="text-lg">Users</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link
                  href="/profile"
                  className={`${
                    pathStart === "profile" ? "font-bold" : ""
                  } cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover`}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <CgProfile className="mr-2 h-6 w-6" />
                    <span className="text-lg">Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
