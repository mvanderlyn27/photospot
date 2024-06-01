import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from '../components/auth/LogoutButton'
import BetaSignup from '@/components/homepage/betaSignup'
export default async function Index() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <div className="w-full relative h-screen " >
      <img className="w-full h-screen object-cover object-top" src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/manhattanSunset1.JPG"></img>
      <div className="absolute top-[4rem] left-0 right-0  top-0  flex items-center justify-center flex-col gap-8">

        <h1 className="text-background pt-20 text-2xl font-semibold tracking-tight lg:text-5xl">
          see <span className="text-primary">NYC</span> in a new lens</h1>
      </div>
      <div className="absolute top-[4rem] left-0 right-0 bottom-0 top-0  flex items-center justify-center flex-col gap-8">
        <h1 className="text-primary scroll-m-20 text-4xl font-semibold tracking-tight lg:text-[200px]">
          PhotoSpot
        </h1>
      </div>

      <div className="absolute bottom-[2rem] left-0 right-0  flex items-center justify-center flex-col">

        <div className="relative">
          <h1 className="text-background scroll-m-20 text-xl font-semibold tracking-tight lg:text-4xl w-[600px] text-center">
            Sign up for beta :)
          </h1>
          <BetaSignup />
        </div>

      </div>


    </div >


  )
}
