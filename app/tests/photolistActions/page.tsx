//need to have test page to test all the db functions 
//figure out later a better way to unit test functions 

//Need to figure out 

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getPhotolistById, searchPhotolistsByName, searchPhotolistsByLocation, updatePhotolist, createPhotolist, deletePhotolist, getPhotolists } from '../../serverActions/photolistActions';
import { PostgrestError } from '@supabase/supabase-js';
import { getPhotospotsFromPhotolist } from '@/app/serverActions/photolistPhotospotBridgeActions';
import PhotoListActionsTest from '@/components/testComponents/photolistsActions';
export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  let photoLists = await getPhotolists();
  if (photoLists.error){
    console.log(photoLists.error)
  }
  //need a way to update data after delete, or update has been called
  return (
    <div className="w-full flex flex-col h-screen">
      
      <PhotoListActionsTest photolists={photoLists.data}/>
    <div>
      <h1>update by id/name</h1>
      
    </div>
    </div>
  )
}
