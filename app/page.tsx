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
            src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/4knyc.jpg?t=2024-05-03T00%3A03%3A32.909Z"
            alt="Title Pic"
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <h1 className="text-background scroll-m-20 text-4xl font-semibold tracking-tight lg:text-9xl">
            PhotoSpot
          </h1>
        </div>
      </div>

      <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="mt-12 lg:mt-0">
              <h1 className="mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                Discover NYC's <br /><span className="text-primary">Most Captivating Spots</span>
              </h1>
              <div className="flex content-center justify-center">
                <a className="mb-2 inline-block rounded bg-primary px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] md:mr-2 md:mb-0"
                  data-te-ripple-init data-te-ripple-color="light" href="/login" role="button">Signup Now :)</a>
              </div>
            </div>
            <div className="mb-12 lg:mb-0">
              <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
                className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="mt-12 lg:mt-0">
              <img src="https://tecdn.b-cdn.net/img/new/standard/city/017.jpg"
                className="w-full rounded-lg shadow-lg dark:shadow-black/20" alt="" />
            </div>
            <div className="mb-12 lg:mb-0">
              <h1 className="mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                Get inpsired by other posts around <span className="text-primary">your city</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
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
      </div>
      <div className="flex flex-col p-10 justify-center">
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
        </div>
      </div>
    </div>
  )
}
