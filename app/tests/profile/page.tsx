//need to have test page to test all the db functions 
//figure out later a better way to unit test functions 

import ProfileTests from '@/components/testComponents/profileTest';
import { ModeToggle } from '@/components/themeToggle';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function Index() {
  // const res = await fetch("http://localhost:3000/api/photolists", {method: "GET"});
  // const data = await res.json();
  // console.log('res',res);
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="w-full flex flex-col h-screen">
      <ModeToggle/>
      <ProfileTests />
    </div>
  )
}
