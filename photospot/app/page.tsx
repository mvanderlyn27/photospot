import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from '../components/LogoutButton'
import { listPhotoSpots } from './photospotActions'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const {data, error} = await listPhotoSpots();
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <h1>Photospot</h1>
          {user ? (
            <div className="flex items-center gap-4">
              Hey, {user.email}!
              <Link
              href="/viewPhotospots"
              className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >Photospots</Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
      <h1>HOMESCREEN</h1>
      <ul className="my-auto text-foreground">
      {
      error ? <li>Error loading photospots {error.message}</li> : 
      data?.map((photospot: any) => (
        <li key={photospot.id}><h3>{photospot.name}</h3><Image width={300} height={300} alt={photospot.name} src={photospot.photo_path}/></li>
      ))}
    </ul>
    </div>
  )
}
