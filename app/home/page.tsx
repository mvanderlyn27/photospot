import PhotospotCard from "@/components/timeline/photospotCard";
import { createClient } from "@/utils/supabase/server";
import { listAllPhotospots } from "../serverActions/photospots/listsAll";
import { redirect } from "next/navigation";

export default async function Home() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/');
    }
    const myPhotospots = await listAllPhotospots();
    return (
        <div className="flex flex-col justify-center gap-8">
            <h2 className="pt-8 text-center text-3xl font-bold">Recent Photospots</h2>
            <div className="flex flex-col justify-center gap-4 p-8">            {
                myPhotospots.map(photospot => <PhotospotCard photospot={photospot} />)
            }
            </div>

        </div>

    )
}