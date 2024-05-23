"use client"
import { FaCopy } from "react-icons/fa";
import { DialogTitle } from "../ui/dialog";
import { RedirectType, usePathname } from "next/navigation";
import { getURL } from "@/utils/vercel/url";
import { Button } from "../ui/button";
import { FaFacebook } from "react-icons/fa";
import { IoMdText } from "react-icons/io";
import { DialogDescription } from "@radix-ui/react-dialog";
import { TwitterShareButton, RedditShareButton, FacebookIcon, TwitterIcon, RedditIcon } from "react-share";
import { useToast } from "../ui/use-toast";
export default function SharePhotospotDialog() {
    const currentPath = getURL() + usePathname().slice(1);
    const { toast } = useToast();
    const handleCopy = () => {
        navigator.clipboard.writeText(currentPath);
        toast({
            title: "Link Copied! :)"
        });
        console.log("link copied")
    }
    return (
        <div className="flex flex-col gap-2 ">
            <DialogTitle>Share</DialogTitle>
            <div className="flex flex-row gap-4 items-center ">
                <DialogDescription className=""><b>URL:</b> {currentPath}</DialogDescription>
                <Button variant={"default"} className="p-2" onClick={() => handleCopy()}><FaCopy className="w-6 h-6" /></Button>
                <TwitterShareButton url={currentPath}><TwitterIcon size={32} round={true} /></TwitterShareButton>
                <RedditShareButton url={currentPath}><RedditIcon size={32} round={true} /></RedditShareButton>
            </div>
        </div >
    )
}