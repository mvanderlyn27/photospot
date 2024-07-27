import CreatePageContainer from "@/components/createPage/createPageContainer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CreatePage() {

  const supabase = createClient()
  const user = await supabase.auth.getUser()
  if (!user.data.user) {
    redirect("/login");
  }
  return (
    <CreatePageContainer />
  )
}