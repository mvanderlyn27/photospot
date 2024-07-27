import { redirect } from "next/navigation";

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  redirect("/user/" + params.userId + "/usersPhotoshots");
}
