//need to have test page to test all the db functions 
//figure out later a better way to unit test functions 

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getPhotolist, getPhotolistById, searchPhotolistsByName, searchPhotolistsByLocation, updatePhotolist, createPhotolist, deletePhotolist } from '../../serverActions/photolistActions';
import { PostgrestError } from '@supabase/supabase-js';
export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const resultOfCreate1 = await createPhotolist({name: "test photolist 1", description: "test photolist"});
  const resultOfCreate2 = await createPhotolist({name: "test photolist 2", description: "test photolist"});
  const resultOfCreate3 = await createPhotolist({name: "foobar", description: "test photolist"});
  const resultOfCreate4 = await createPhotolist({name: "foobar 2", description: "test photolist to be deleted"});
  let photoList = await getPhotolist();
  const photoListById = await getPhotolistById(resultOfCreate1.id);
  const photoListByName = await searchPhotolistsByName("foo");
  const updatePhotolistOut = await updatePhotolist(resultOfCreate1.id+3, {name: 'test photolist 3'});
  photoList = await getPhotolist();
  // console.log('photospots from photolist', getPhotospotsFromPhotolistOut);
  console.log('res create 1',resultOfCreate1, 'res create 2',resultOfCreate2, 'res create 3',resultOfCreate3, 'res create 4', resultOfCreate4, 'photolist',photoList, 'photolist by id',photoListById, 'photolist by name',photoListByName, 'update photo list', updatePhotolistOut, 'get photospots', getPhotospotsFromPhotolistOut);
  photoList?.forEach(async element => {
    if(element.name.includes('test')){
      const out = await deletePhotolist(element.id);
    }
  })

  return (
    <div className="w-full flex flex-col h-screen">
        
    </div>
  )
}
