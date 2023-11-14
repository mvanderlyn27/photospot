import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '../components/LogoutButton'
export default async function Index() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <div className="w-full flex flex-col h-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <h1>PhotoSpot</h1> 
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
      <div className="flex flex-col h-full text-center items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-4xl">PhotoSpot</h1>
        <p className="mt-3 text-lg">Find the best places for pics in NYC.</p>
      </div>
    </div>
    )
}
