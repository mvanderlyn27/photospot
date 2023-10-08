"use server";
import UploadPhotospot from "@/components/UploadPhotospot";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from 'next/image'
import Link from "next/link";
import { listPhotoSpots } from '../photospotActions'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {data, error} = await listPhotoSpots();

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
    <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>
      <ul className="my-auto text-foreground">
      {
      error ? <li>Error loading photospots {error.message}</li> : 
      data?.map((photospot: any) => (
        <li key={photospot.id}><h3>{photospot.name}</h3><Image width={300} height={300} alt={photospot.name} src={photospot.photo_path}/></li>
      ))}
    </ul>
    <UploadPhotospot/>
    </div>
  );
}