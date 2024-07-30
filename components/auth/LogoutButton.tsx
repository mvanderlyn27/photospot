"use client";
import { Button } from "../ui/button";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { CiLogout } from "react-icons/ci";
export default function LogoutButton() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await mutate("/api/profile", null);
    router.push("/");
    router.refresh();
  };
  const { trigger: logout } = useSWRMutation("/api/auth/logout", handleLogout);
  return (
    <div
      className="cursor-pointer py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover justify-center items-center"
      onClick={() => logout()}
    >
      <CiLogout className="mr-2 h-6 w-6" />
      <Button variant="outline">Logout</Button>
    </div>
  );
}
