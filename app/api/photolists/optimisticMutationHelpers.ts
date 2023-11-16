import { Photolist, PhotolistInput } from "@/types/photospotTypes";

export const deletePhotolistMutation = async (id:number, photolists: Photolist[] | undefined) => {
      const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
      const response = await fetch('/api/photolists/delete', {method: 'POST', body: JSON.stringify({id: id})})
      if(!response.ok)
      {
        console.log('error deleting photolist')
        return photolists
      }
      return updated_photolist
}
export const deletePhotolistOptions = (id: number, photolists: Photolist[] | undefined) => {
    const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
    const options = {
        optimisticData: updated_photolist,
        rollBackOnError: true
      }
      return options;
}

export const createPhotolistMutation = async (photolist: PhotolistInput, photolists: Photolist[] | undefined, photospots: number[] | undefined) => {
    const raw_resp = await fetch('/api/photolists/create', {method: 'POST', body: JSON.stringify({photolist: photolist, photospots: photospots})});
    if(!raw_resp.ok)
    {
      console.log('error creating photolist')
      return photolists
    }
    const data = await raw_resp.json();
    console.log('create data: ',data);
    return photolists ? [...photolists, data] : [data];
}
export const createPhotolistOptions = (photolist: Photolist, photolists: Photolist[] | undefined) => {
    //eventually id should be fixed, but if you update before it corrects, will error
    const options = {
      optimisticData: photolists? [...photolists, photolist] : [photolist],
      rollBackOnError: true
    }
    return options;
}

export const updatePhotolistMutation = async (id:number, photolist: Photolist, photolists: Photolist[] | undefined, photospots: number[] | undefined) => {
    const raw_resp = await fetch('/api/photolists/update', {method: 'POST', body: JSON.stringify({id: id, photolist:photolist, photospots: photospots})});
    if(!raw_resp.ok)
    {
      console.log('error updating photolist')
    }
    else if(photolists){
        const old_index = photolists.map(e => e.id).indexOf(id);
        console.log('old index', photolists,old_index);
        photolists[old_index] = photolist;
    }
    return photolists
}
export const updatePhotolistOptions = (id: number, photolist: Photolist, photolists: Photolist[] | undefined) => {
    console.log('before',photolists);
    let updated_photolist : Photolist[] = [];
    if(photolists){
      updated_photolist = [...photolists];
      const old_index = updated_photolist.map(e => e.id).indexOf(id);
      updated_photolist[old_index] = photolist;
    }
    console.log('after',photolists);
    const options = {
      optimisticData: updated_photolist, 
      rollBackOnError: true
    }
    return options;
}






//// ROUTE HANDLER HELPERS

