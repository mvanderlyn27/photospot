import PhotospotCard from "@/components/timeline/photospotCard";
import { createClient } from "@/utils/supabase/server";
import { listAllPhotospots } from "../serverActions/photospots/listAllPhotospots";
import { redirect } from "next/navigation";
import Timeline from "@/components/homePage/timeline";

export default async function Home() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/');
    }
    return (
        <Timeline />
    )
}