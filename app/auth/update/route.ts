import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//function to update email and/or password, required email confirmation to complete
export async function POST(request: NextResponse) {
      const body = await request.json();
      console.log('updating user', body);
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
      let updateInfo: any = {};
      if(body.password){
            updateInfo.password= body.password; 
      }
      if(body.email){
            updateInfo.email = body.email; 
      }
      const { data, error } = await supabase.auth.updateUser(updateInfo);
      if(error){
            console.log('error updating user info', error);
        return NextResponse.json(error, {status: 500});
      }
      return NextResponse.json(data, {status: 200});
}