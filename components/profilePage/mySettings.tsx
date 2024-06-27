"use client"
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import SettingSection from "./settingSection";

export default function MySettings() {

    const { data: user } = useSWR("/api/user", fetcher);
    return <SettingSection user={user} />
}