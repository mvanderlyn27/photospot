import ProfilePageSection from "@/components/profilePage/profilePageSection";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageSection />;
    </Suspense>
  );
}
