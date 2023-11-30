import { Photospot, PhotospotInput } from "@/types/photospotTypes";

export const deletePhotospottMutation = async (id:number, photolists: Photospot[] | undefined) => {
    const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
    const response = await fetch('/api/photospots/delete', {method: 'POST', body: JSON.stringify({id: id})})
    console.log('resp: ',response);
    if(!response.ok)
    {
      console.log('error deleting photolist')
      return photolists
    }
    return updated_photolist
}
export const deletePhotospotOptions = (id: number, photospots: Photospot[] | undefined) => {
  const updated_photospots = photospots?.filter((photospot)=>{if(photospot.id!=id)return photospot});
  const options = {
      optimisticData: updated_photospots,
      rollBackOnError: true
    }
    return options;
}

export const createPhotospotMutation = async ( formData: FormData, photospots: Photospot[] | undefined) => {
    const raw_resp= await fetch('/api/photospots/create', {method: 'POST', body: formData});
    if(!raw_resp.ok)
    {
      console.log('error creating photolist')
      return photospots
    }
    const data = await raw_resp.json();
    console.log('create data: ',data);
    return photospots ? [...photospots, data] : [data];
}

export const createPhotospotOptions = (photospotInfo: any, photospots: Photospot[] | undefined) => {
    const options = {
        optimisticData: photospots? [...photospots, photospotInfo] : [photospotInfo],
        rollBackOnError: true
    }
    return options;
}


export const updatePhotospotMutation = async (formData: FormData, photospots: Photospot[] | undefined) => {
    const id = formData.get('id')?.toString();
    //have 2 promises that fetch the blurHash image, and the actual api call 
    const raw_resp = await fetch('/api/photospots/update', {method: 'POST', body: formData});
    // const { base64 } = await getPlaiceholder(file);
    if(!raw_resp.ok)
    {
      console.log('error updating photolist')
    }
    else if(photospots && id !== undefined){
        const updated = await raw_resp.json();
        const old_index = photospots.map(e => e.id).indexOf(Number(id));
        console.log('update info: photospots: ', photospots,'old info: ',old_index, 'updated', updated);
        //works temporarily, but doesn't actually affect reloads of webpage
        //probably should move to a db 
        photospots[old_index] = updated;
    }
    return photospots
}
export const updatePhotospotOptions = (photoSpotInfo:any, photospots: Photospot[] | undefined) => {
    let updated_photolist : Photospot[] = [];
    if(photospots && photoSpotInfo.id){
      updated_photolist = [...photospots];
      const old_index = updated_photolist.map(e => e.id).indexOf(photoSpotInfo.id);
      //turn this into a library maybe?
      updated_photolist[old_index] = photoSpotInfo;
      console.log('optimistic info: ', updated_photolist);
    }
    const options = {
      optimisticData: updated_photolist, 
      rollBackOnError: true
    }
    return options;
}


// FETCHERS
export const searchByName = (url : string,  {arg} : {arg: {name: string}}) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json())
}
export const searchById = (url : string,  {arg} : {arg: {id: number}}) =>{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json())
}
export const searchByLocation = (url : string,  {arg} : {arg: {location: string}}) =>{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json()) 
}
export const searchByTime = (url : string,  {arg} : {arg: {start: number, end: number, ascending: boolean}}) =>{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json()) 
}