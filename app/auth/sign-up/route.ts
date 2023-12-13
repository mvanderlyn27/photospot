import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
const bucket = "profile_pictures";
export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const username = String(formData.get('username'))
  const supabase = createRouteHandlerClient({ cookies })
  console.log('info',email, password);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      data: {
        username: username 
      }
    },
  })
  console.log('signup error', error);
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    )
  }
  if(data.user)
  {
    const { error: storagePicError } = await supabase.storage.from(bucket).copy('default.jpg', data.user.id );
    if(storagePicError){
        console.log('storage error', storagePicError);
        return NextResponse.json(storagePicError,{status: 500});
    }
  }
  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to continue sign in process`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  )
}
