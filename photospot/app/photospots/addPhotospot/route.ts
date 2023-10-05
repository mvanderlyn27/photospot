// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextRequest, NextResponse } from 'next/server'

// export const dynamic = 'force-dynamic'

// export async function POST(request: NextRequest) {
// //   const requestUrl = new URL(request.url)
//   const supabase = createRouteHandlerClient({ cookies })
// //   const file = event.target.files[0];
//     const file = request.body?.
//     const bucket = "documents"

//     // Call Storage API to upload file
//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .upload(file.name, file);

//     // Handle error if upload failed
//     if(error) {
//       alert('Error uploading file.');
//       return;
//     }


// //   await supabase.auth.signOut()

// //   return NextResponse.redirect(`${requestUrl.origin}/login`, {
//     // a 301 status is required to redirect from a POST to a GET route
//     // status: 301,
// //   })
// }