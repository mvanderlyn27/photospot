"use client"
import useSWR from "swr";
import {Photolist, PhotolistInput, Photospot} from "../../types/photospotTypes"
import Loading from "../Loading";
import { MouseEvent, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { createPhotolistMutation, createPhotolistOptions, deletePhotolistMutation, deletePhotolistOptions, updatePhotolistMutation, updatePhotolistOptions, searchById, searchByName, getPhotolistsPhotospots } from "../../app/api/photolists/helpers/optimisticMutationHelpers";
import { fetcher } from "@/app/swr-provider";
import useSWRMutation from 'swr/mutation'


/*Things to test
    creation w/ photo upload/ optional photolist 
    Update data
    delete w/ auto delete of photolist links
    search w/ filters
        search by name
        search by location
        search by time (new photospots)
        search by rating
        search by "hot'"
    search within a box
    review location (just number, number + text, number + text + pic)

*/

export default function PhotoSpotTests(){
    //use state here to track form info
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [id, setUpdateId] = useState(-1);
    const [photospots, setUpdatePhotospots] = useState('');
    const [name2, setUpdateName] = useState('');
    const [description2, setUpdateDescription] = useState('');
    const [photospots2, setUpdatePhotospots2] = useState('');
    const [photolistById, setPhotolistById] = useState(-1);
    const [photolistByName, setPhotolistByName] = useState('');
    const [photolistsPhotospotsId, setphotolistsPhotospotsId] = useState(-1);
    const { data: photolists, error, isLoading, mutate: refreshPhotolists } = useSWR<Photolist[], {error:PostgrestError, message:number}, any>("/api/photolists/" , fetcher);
    const { data: photolistByIdInfo, trigger: getPhotolistById }: {data: Photolist, trigger: any} = useSWRMutation('/api/photolists/getById', searchById);
    const { data: photolistByNameResults, trigger: getPhotolistByName }: {data: Photolist[], trigger: any} = useSWRMutation('/api/photolists/search/byName', searchByName);
    const { data: photolistsPhotospotsResults, trigger: getPhotolistsFromPhotospots}: {data: Photospot[], trigger: any} = useSWRMutation('/api/photolists/getPhotolistsPhotospots', getPhotolistsPhotospots);


    const handleDelete = async (id: number) => {
      await refreshPhotolists(deletePhotolistMutation(id, photolists), deletePhotolistOptions(id, photolists));
    }

    const handleCreate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      const photolist = {name: name, description: description}
      let max_id = -1;
      if(photolists){
        max_id = Math.max(...photolists.map(photolist => {return photolist.id}));
      }
      //chicken and egg issue here, need id, and created by etc info, but can't get until we make the new object
      //maybe for now don't use 
      const photospots_ar =  photospots.split(`,`).map(x => Number(x));
      await refreshPhotolists(createPhotolistMutation(photolist, photolists, photospots_ar), createPhotolistOptions({...photolist, id: max_id+1},photolists));
    }

    const handleUpdate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      const photolist = {id: id, name: name2, description: description2, }
      const photospots_ar =  photospots2.split(`,`).map(x => Number(x));
      await refreshPhotolists(updatePhotolistMutation(id, photolist, photolists, photospots_ar), updatePhotolistOptions(id, photolist ,photolists));
    }

    const handleSearchById = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      if(photolistById){
        await getPhotolistById({id: photolistById});
        console.log(photolistByIdInfo)
      }
      else{
        console.log('please enter id before searching');
      }
    }

    const handleSearchByName = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      if(photolistByName){
        await getPhotolistByName({search_string: photolistByName});
        console.log(photolistByNameResults);
      }
      else{
        console.log('please enter name before searching');
      }
    }

    const handleGetPhotolistsPhotospots = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      if(photolistsPhotospotsId){
        await getPhotolistsFromPhotospots({id: photolistsPhotospotsId});
        console.log(photolistsPhotospotsResults);
      }
      else{
        console.log('please enter id before loading photospots');
      }
    }

    if(error){
      return <h1>error: {error.message}</h1>
    }
    if(isLoading){
      return <Loading/>
    }
    return(
      <div>
      {
          photolists ? photolists.map(photolist=> {
            return <div key ={photolist.id} >
              <h1 key={photolist.id}>{photolist.id}  : {photolist.name}</h1>
              <button disabled={photolist.id === -1} onClick={()=>handleDelete(photolist.id)}>Delete</button>
              </div>
          }) : <h1>no data</h1> 
        }
        <h1>Add photolist</h1>
        <form >
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photolist name:</label>
            <input type="text" onChange={(e)=>setName(e.target.value)} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="test" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photolist description:</label>
            <input type="text" onChange={(e)=>setDescription(e.target.value)} id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="photospots" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photospots:</label>
            <input type="text" id="photospots"  onChange={(e)=>setUpdatePhotospots(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
          </div>
          <button type="submit" onClick={(e)=>handleCreate(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
        <h1>Update Data</h1>
        <form >
        <div className="mb-6">
            <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photolist id:</label>
            <input type="number" onChange={(e)=>setUpdateId(Number(e.target.value))} id="id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="id" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="name2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photolist name:</label>
            <input type="text" onChange={(e)=>setUpdateName(e.target.value)} id="name2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="description2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photolist description:</label>
            <input type="text" onChange={(e)=>setUpdateDescription(e.target.value)} id="description2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="photospots2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photospots:</label>
            <input type="text" id="photospots2"  onChange={(e)=>setUpdatePhotospots2(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
          </div>
          <button type="submit" onClick={(e)=>handleUpdate(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form> 
        <h1>Get Photolist by id</h1>
        {
          photolistByIdInfo && <h2>photospot info: {JSON.stringify(photolistByIdInfo)}</h2>
        }
        <form>
        <div className="mb-6">
            <label htmlFor="searchById" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photolist id:</label>
            <input type="number" onChange={(e)=>setPhotolistById(Number(e.target.value))} id="searchById" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="id" required/>
          </div>
          <button type="submit" onClick={(e)=>handleSearchById(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
        <h1>Search Photolist by name</h1>
        {
          photolistByNameResults && 
          photolistByNameResults.map(photolistByNameInfo => {
          return <h2 key={photolistByNameInfo.id}>photospot info: {JSON.stringify(photolistByNameInfo)}</h2>
          }) 
        }
        <form>
        <div className="mb-6">
            <label htmlFor="searchByName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search by name:</label>
            <input type="string" onChange={(e)=>setPhotolistByName(e.target.value)} id="searchByName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="search name" required/>
          </div>
          <button type="submit" onClick={(e)=>handleSearchByName(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
        <h1>Get a Photolists Photospots</h1>
        {
          photolistsPhotospotsResults && 
          photolistsPhotospotsResults.map(photospot => {
          return <h2 key={photospot.id}>photospot info: {JSON.stringify(photospot)}</h2>
          }) 
        }
        <form>
        <div className="mb-6">
            <label htmlFor="photolistsPhotospots" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter photolist id:</label>
            <input type="number" onChange={(e)=>setphotolistsPhotospotsId(Number(e.target.value))} id="photolistsPhotospots" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="photolist's id" required/>
          </div>
          <button type="submit" onClick={(e)=>handleGetPhotolistsPhotospots(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
      </div>
    );
}


