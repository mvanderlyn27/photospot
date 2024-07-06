"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchQuery = request.nextUrl.searchParams;
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("not logged in", { status: 401 });
  }
  let pageCount = 1;
  if (searchQuery.get("page_count")) {
    pageCount = parseInt(searchQuery.get("page_count") as string);
  }
  const username_query = searchQuery.get("username_query");
  console.log("username_query", username_query);
  const query = supabase.rpc("search_profiles_by_username", {
    search_query: username_query ? username_query : "",
    page_count: pageCount,
  });

  const { data, error } = await query;
  if (error) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
  console.log("data", data);
  return new Response(JSON.stringify(data), { status: 200 });
}
