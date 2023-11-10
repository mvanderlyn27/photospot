"use client"
import {Photolist} from "../../types/photospotTypes"
import { getPhotolistById, searchPhotolistsByName, searchPhotolistsByLocation, updatePhotolist, createPhotolist, deletePhotolist, getPhotolists } from '../../app/serverActions/photolistActions';
export default function PhotoListActionsTest({photolists}: {photolists: Photolist[]|null}){
    
    
    return(
        //need to have ability to update, and to get list from photospot, and delete 
        <div>
        {
            photolists!= null ? photolists.map(photolist => {
              return <div>
                <h1 key={photolist.id}>{photolist.id}  : {photolist.name}</h1>
                <button onClick={async () =>{deletePhotolist(photolist.id)}}>Delete Photolist</button>
                </div>
            }) : <h1>no photospots</h1>
          }
          
        </div>

    );
}