import UserSearchSection from "@/components/userPage/userSearchSection";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense>
      <UserSearchSection />;
    </Suspense>
  );
}
