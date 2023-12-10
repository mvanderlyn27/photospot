import { PublicProfile } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
const bucket = "profile_pictures"
//probably pull these out to their own routes under auth for updating password/email, username meta data can stay here
const getAuthUpdatePromise = (info: PublicProfile, supabase: any, metadata: any) =>{
    let updateInfo: any= {};
    console.log('checking info for auth', info);
    if(info.username!==undefined){
        metadata.username = info.username; 
        updateInfo.data = metadata;
    }
    if(Object.entries(updateInfo).length <= 0){
        console.log('no auth updates');
        return null;
    }
    console.log('updating auth info: ',updateInfo);
    return supabase.auth.updateUser(updateInfo);
}
const getPrivateProfileUpdatePromise = (info: PublicProfile, supabase: any, id: string) =>{
    let updateInfo: any= {};
    if(info.theme!==undefined){
        updateInfo.theme = info.theme;
    }
    if(Object.entries(updateInfo).length <= 0){
        console.log('no priv profile updates');
        return null;
    }
    return supabase.from('profiles_priv').update(updateInfo).eq('id',id)
}
const getPublicProfileUpdatePromise = (info: PublicProfile, supabase: any, id: string ) =>{
    let updateInfo: any= {};
    if(info.username!==undefined){
        updateInfo.username = info.username;
    }
    if(info.private!==undefined){
        updateInfo.private = info.private;
    }
    if(Object.entries(updateInfo).length <= 0){
        console.log('no public profile updates');
        return null;
    }
    return supabase.from('profiles').update(updateInfo).eq('id',id)
}

export async function POST(request: NextResponse) {
    const formData = await request.formData();
    console.log('updating user', formData);
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    const { data: { session }, } = await supabase.auth.getSession();
    if(session === null){
        console.log('error updating user, no one logged in')
        return NextResponse.json("no user logged in", {status: 500});
    }
    let promises: any[]= [];
    const user_id = session.user.id;
    const photo = formData.get("profile_picture");
    if(photo!= null){
        promises.push(supabase.storage.from(bucket).upload(user_id, photo, {upsert: true}));
    }
    const profile_info_raw = formData.get('profile_info');
    if(profile_info_raw){
    // split up if its private or public data to update
        const profileInfo = JSON.parse(profile_info_raw.toString());
        const auth_update_promise = getAuthUpdatePromise(profileInfo, supabase, session.user.user_metadata);
        if(auth_update_promise){
            promises.push(auth_update_promise);
        }
        const private_profile_promise = getPrivateProfileUpdatePromise(profileInfo, supabase, user_id);
        if(private_profile_promise){
            promises.push(private_profile_promise);
        }
        const public_profile_promise = getPublicProfileUpdatePromise(profileInfo, supabase, user_id);
        if(public_profile_promise){
            promises.push(public_profile_promise);
        }
    }
    const values = await Promise.all(promises);
    values.forEach(out => {
        console.log('response from update promises', out);
        if(out.error) {
            console.log('error', out.error);
            return NextResponse.json({error: out.error},{status: 500});
        }
    });
    
    return NextResponse.json({status: 200})
}


