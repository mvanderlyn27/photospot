import { Photolist, PhotolistInput } from "@/types/photospotTypes";

export const deletePhotolistMutation = async (id:number, photolists: Photolist[] | undefined) => {
      const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
      const response = await fetch('http://localhost:3000/data/photolists/delete', {method: 'POST', body: JSON.stringify({id: id})})
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

export const createPhotolistMutation = async (photolist: PhotolistInput, photolists: Photolist[] | undefined) => {
    const raw_resp = await fetch('http://localhost:3000/data/photolists/create', {method: 'POST', body: JSON.stringify(photolist)});
    if(!raw_resp.ok)
    {
      console.log('error deleting photolist')
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

export const updatePhotolistMutation = async (id:number, photolist: Photolist, photolists: Photolist[] | undefined) => {
    const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
    const response = await fetch('http://localhost:3000/data/photolists/update', {method: 'POST', body: JSON.stringify({id: id})})
    if(!response.ok)
    {
      console.log('error deleting photolist')
      return photolists
    }
    return updated_photolist
}
export const updatePhotolistOptions = (id: number, photolist: Photolist, photolists: Photolist[] | undefined) => {
  const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
  const options = {
      optimisticData: updated_photolist,
      rollBackOnError: true
    }
    return options;
}