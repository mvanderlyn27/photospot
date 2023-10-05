// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export const dynamic = 'force-dynamic'

// export async function POST(request: Request) {
//     const supabase = createRouteHandlerClient({ cookies })
//     const avatarFile = ""; // event.target.files[0]
//     const { data, error } = await supabase
//     .storage
//     .from('photospots1')
//     .upload('public/avatar1.png', avatarFile, {
//         cacheControl: '3600',
//         upsert: false
//   })
// }