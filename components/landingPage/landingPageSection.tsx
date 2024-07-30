"use client";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/auth/LogoutButton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default function LandingPageSection() {
  return (
    <motion.div
      key={"landingPageSection"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.25, 0, 1],
        // delay: recalculatedDelay,
        delay: 0.2,
      }}
    >
      <div className="w-full  h-screen hidden md:flex flex-col">
        <div className="relative p-10">
          <div className="h-[calc(100vh-144px)] w-full relative rounded-md">
            <Image
              fill
              src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/manhattanSunset1.JPG"
              alt="Title Pic"
              style={{ objectFit: "cover", objectPosition: "top" }}
              className="rounded-lg"
            />
          </div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.35, 0.17, 0.3, 0.86],
              // delay: recalculatedDelay,
              delay: 0.2,
            }}
          >
            <h1 className="text-background scroll-m-20 text-4xl font-semibold tracking-tight lg:text-9xl">
              PhotoSpot
            </h1>
          </motion.div>
        </div>

        <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left w-full">
          <div className="w-full p-20">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="mt-12 lg:mt-0">
                <h1 className="mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                  Discover NYC's <br />
                  <span className="text-primary">Most Captivating Spots</span>
                </h1>
                <div className="flex content-center justify-center">
                  <a
                    className="mb-2 inline-block rounded bg-primary px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] md:mr-2 md:mb-0"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    href="/login"
                    role="button"
                  >
                    Signup Now :)
                  </a>
                </div>
              </div>
              <div className="mb-12 lg:mb-0 relative w-full h-[600px] overflow-hidden">
                <Image
                  src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/manhattanSunset3.JPG"
                  className="object-cover w-full rounded-lg shadow-lg dark:shadow-black/20"
                  fill
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
          <div className="w-full p-20">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="mt-12 lg:mt-0 relative w-full h-[600px] overflow-hidden">
                <Image
                  src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/home.JPG"
                  className="object-cover w-full rounded-lg shadow-lg dark:shadow-black/20"
                  alt=""
                  fill
                />
              </div>
              <div className="mb-12 lg:mb-0">
                <h1 className="mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                  Get inpsired by other posts around{" "}
                  <span className="text-primary">your city</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left">
          <div className="w-full p-20">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="mt-12 lg:mt-0">
                <h1 className="mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                  Share your favorite spots with your friends/community
                </h1>
                <div className="flex content-center justify-center"></div>
              </div>
              <div className="mb-12 lg:mb-0 relative w-full h-[600px] overflow-hidden">
                <Image
                  src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/mapPhotospots2.JPG"
                  className="object-cover w-full rounded-lg shadow-lg dark:shadow-black/20"
                  alt=""
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100vw] h-[calc(100vh-64px)] md:hidden">
        <div className="w-full h-full relative">
          <Image
            src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/manhattanSunset1.JPG"
            fill
            alt=""
            className="object-cover "
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
          <h1 className="text-background scroll-m-20 text-5xl font-semibold tracking-tight mt-96">
            PhotoSpot
          </h1>
          <Link
            className={`${cn(buttonVariants({ variant: "default" }))} text-xl`}
            data-te-ripple-init
            data-te-ripple-color="light"
            href="/login"
            role="button"
          >
            Signup Now :)
          </Link>
        </div>
        <div className="text-center pt-4">
          <div className="grid items-center gap-4 p-4">
            <h1 className=" text-4xl font-bold tracking-tight md:text-6xl xl:text-7xl">
              Discover NYC's <br />
              <span className="text-primary">Most Captivating Spots</span>
            </h1>
            <div className="flex content-center justify-center"></div>
            <div className="relative w-full h-[400px] overflow-hidden">
              <Image
                src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/manhattanSunset3.JPG"
                className="object-cover w-full rounded-lg shadow-lg dark:shadow-black/20"
                fill
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="grid items-center gap-4 p-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Get inpsired by other posts around{" "}
              <span className="text-primary">your city</span>
            </h1>
            <div className="relative w-full h-[400px] overflow-hidden">
              <Image
                src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/home.JPG"
                className="object-cover w-full rounded-lg shadow-lg dark:shadow-black/20"
                alt=""
                fill
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="w-full ">
            <div className="grid items-center gap-4 p-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Share your favorite spots with your friends/community
              </h1>
              <div className=" relative w-full h-[400px] overflow-hidden">
                <Image
                  src="https://vkfbzrfveygdqsqyiggk.supabase.co/storage/v1/object/public/website_pictures/mapPhotospots2.JPG"
                  className="object-cover w-full rounded-lg shadow-lg dark:shadow-black/20"
                  alt=""
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
