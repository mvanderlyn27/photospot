"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import SettingSection from "./settingsSection/settingSection";

export default function MySettings() {
  const { data: user } = useSWR("/api/profile", fetcher);
  return <SettingSection user={user} />;
}
