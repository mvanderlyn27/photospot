import { Photospot } from "@/types/photospotTypes";

export const deletePhotospottMutation = async (id:number, photolists: Photospot[] | undefined) => {
    const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
    const response = await fetch('/api/photolists/delete', {method: 'POST', body: JSON.stringify({id: id})})
    if(!response.ok)
    {
      console.log('error deleting photolist')
      return photolists
    }
    return updated_photolist
}
export const deletePhotospotOptions = (id: number, photolists: Photospot[] | undefined) => {
  const updated_photolist = photolists?.filter((photolist)=>{if(photolist.id!=id)return photolist});
  const options = {
      optimisticData: updated_photolist,
      rollBackOnError: true
    }
    return options;
}