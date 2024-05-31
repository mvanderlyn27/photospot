import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from '../components/auth/LogoutButton'
export default async function Index() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <div className="w-full flex flex-col h-screen">

      <div className="relative p-10">
        <div className="h-[calc(100vh-144px)] w-full relative rounded-md" >
          <Image
            fill
            src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/night.JPG"
            alt="Title Pic"
            style={{ objectFit: "cover", objectPosition: "60% 40%" }}
            className="rounded-lg"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-8">
          <h1 className="text-background scroll-m-20 text-4xl font-semibold tracking-tight lg:text-9xl">
            PhotoSpot
          </h1>
          <h1 className="text-background scroll-m-20 text-2xl font-semibold tracking-tight lg:text-5xl">
            {/* coming soon, sign up to get notified */}
            coming soon..
          </h1>
        </div>
      </div>

      <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="mt-12 lg:mt-0">
              <h1 className="mb-16 text-3xl font-bold tracking-tight md:text-3xl xl:text-5xl">
                {/* Discover NYC's <br /><span className="text-primary">Most Captivating Spots</span> */}
                Find cool spots to take pictures around <span className="text-primary">NYC</span>
              </h1>
              <div className="flex content-center justify-center">
              </div>
            </div>
            <div className="mb-12 lg:mb-0">
              <img src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/sunset_2.jpg"
                className="w-full object-cover h-[500px] rounded-lg shadow-lg dark:shadow-black/20" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="mt-12 lg:mt-0">
              <img src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/mapPhotospots.JPG"
                className="w-full object-cover h-[500px] rounded-lg shadow-lg dark:shadow-black/20" alt="" />
            </div>
            <div className="mb-12 lg:mb-0">
              <h1 className="mb-16 text-3xl font-bold tracking-tight md:text-3xl xl:text-5xl">
                Get inpsired by other posts around <span className="text-primary">your city</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="mt-12 lg:mt-0">
              <h1 className="mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                Share your favorite spots with your friends/community
              </h1>
              <div className="flex content-center justify-center">
              </div>
            </div>
            <div className="mb-12 lg:mb-0">
              <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
                className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="flex flex-col p-10 justify-center">
        <h1 className="text-center mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl"> Checkout a few of our favorite Photospots:</h1>
        <div className="pl-20 pr-20 grid item-center gap-12 lg:grid-cols-3">

          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
          <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
            className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
        </div> */}
      {/* </div> */}
    </div >
  )
}
