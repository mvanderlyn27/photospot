import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function ResetPassword() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <div className="absolute inset-0 h-screen flex items-center justify-center">
      <ResetPasswordForm />
    </div>
  );
}
