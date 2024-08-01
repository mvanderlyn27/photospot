import UserPageSection from "@/components/userPage/userPageSection";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <Suspense>
      <UserPageSection
        userId={params.userId ? params.userId : "userPhotoshots"}
      />
    </Suspense>
  );
}
