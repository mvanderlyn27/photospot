"use server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    console.log("not logged in");
    return new Response(JSON.stringify({ error: "not logged in" }), {
      status: 500,
    });
  }
  const { data, error } = await supabase
    .from("user_follows")
    .select("*")
    .eq("follower", params.userId)
    .eq("followee", user.data.user.id);
  if (error) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: "error getting followers" }), {
      status: 500,
    });
  }
  if (!data || !data.length) {
    return new Response(JSON.stringify(false), { status: 200 });
  } else {
    return new Response(JSON.stringify(true), { status: 200 });
  }
}
