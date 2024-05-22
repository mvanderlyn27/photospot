"use client"
import { FaCopy } from "react-icons/fa";
import { DialogTitle } from "../ui/dialog";
import { usePathname } from "next/navigation";
import { getURL } from "@/utils/vercel/url";
import { Button } from "../ui/button";
import { FaFacebook } from "react-icons/fa";
import { IoMdText } from "react-icons/io";
import { DialogDescription } from "@radix-ui/react-dialog";
export default function SharePhotospotWidget() {
    const currentPath = getURL() + usePathname().slice(1);
    return (
        <div className="flex flex-col gap-2">
            <DialogTitle>Share</DialogTitle>
            <div className="flex flex-row gap-4 ">
                <DialogDescription className=""><b>URL:</b> {currentPath}</DialogDescription>
                <Button variant={"outline"}><FaCopy className="w-6 h-6" /></Button>
            </div>
            <div className="flex flex-row gap-4 justify-center">
                <Button><FaFacebook className="w-6 h-6" /></Button>
                <Button><IoMdText className="w-6 h-6" /></Button>
            </div>
        </div >
    )
}