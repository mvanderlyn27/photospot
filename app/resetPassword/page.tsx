import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
export default async function ResetPassword() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <div className="absolute inset-0 h-screen flex items-center justify-center" >
      <ResetPasswordForm />
    </div>
  )
}
