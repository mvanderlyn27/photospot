import ProfilePageSection from "@/components/profilePage/profilePageSection";
import { Suspense } from "react";

export default function ProfilePage({
  params,
}: {
  params: { profileSection: string };
}) {
  return (
    <Suspense>
      <ProfilePageSection
        initialProfileSection={
          params.profileSection ? params.profileSection : "myPhotoshots"
        }
      />
      ;
    </Suspense>
  );
}
