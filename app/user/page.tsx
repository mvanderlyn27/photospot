import UserSearchSection from "@/components/userPage/userSearchSection";

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return <UserSearchSection />;
}
