"use client"
import useSWR from "swr";
import {Photolist, PhotolistInput, Photospot} from "../../types/photospotTypes"
import Loading from "../Loading";
import { MouseEvent, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { createPhotospotMutation, createPhotospotOptions, updatePhotospotMutation, updatePhotospotOptions } from "@/app/api/photospots/helpers/optimisticMutationHelpers";
import { fetcher } from "@/app/swr-provider";
import useSWRMutation from 'swr/mutation'
import { FaPlus, FaEdit, FaSearch, FaTrashAlt, FaList  } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PhotospotGrid from "../PhotoSpotGrid";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Checkbox } from "../ui/checkbox";

/*Things to test
    creation w/ photo upload/ optional photolist 
    Update data w/ photolist info
      private/unprivate
      draft / non draft version
    delete w/ auto delete of photolist links
    search w/ filters
        search by name
        search by location
        search by time (new photospots)
        search by rating
        search by "hot'"
    search within a box
  
    review location (just number, number + text, number + text + pics
    get photospots for a user

*/

export default function PhotoSpotTests(){
  //STATE COMPONENT STATE
  //use state here to track form info
  // const [name, setName] = useState('');
  // const [description, setDescription] = useState('');
  // const [location, setLocation]: [LatLng | null, any] = useState(null);
  // const [id, setUpdateId] = useState(-1);
  // const [photolistById, setPhotolistById] = useState(-1);
  // const [photolistByName, setPhotolistByName] = useState('');
  // const [photolistsPhotospotsId, setphotolistsPhotospotsId] = useState(-1);
  const { data: photospots, error, isLoading, mutate: refreshPhotospots } = useSWR<Photospot[], {error:PostgrestError, message:number}, any>("/api/photospots/" , fetcher);
  // const { data: photolistByIdInfo, trigger: getPhotolistById }: {data: Photolist, trigger: any} = useSWRMutation('/api/photospots/getById', searchById);
  // const { data: photolistByNameResults, trigger: getPhotolistByName }: {data: Photolist[], trigger: any} = useSWRMutation('/api/photolists/search/byName', searchByName);



//FORM VALIDATION SECTION

// CAN DO FILE UPLOAD BY EITHER USING A FILEREF like in the testForm.tsx, or by modifying onchange as seen here
  const MAX_FILE_SIZE = 5242880; //5MB
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const createFormSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string(),
    photospot_pictures : z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    ),
    latitude: z.coerce.number().gt(-90, {message:"latitude is too small" }).lt(90, {message:"latitude is too big" }),
    longitude: z.coerce.number().gt(-180, {message: "longitude is too small"}).lt(180, {message:"longitude is too big"}),
    draft: z.boolean().default(false).optional(),
  })
  const createForm = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      description: "",
      photospot_pictures: undefined,
      latitude: undefined,
      longitude: undefined,
      draft: false
    },
    mode: 'onChange',
  });

  const handleCreate = async (values: z.infer<typeof createFormSchema>) => {
    console.log('create new photospot',JSON.stringify(values));
    console.log('photos',values.photospot_pictures);
    let formData = new FormData();
    const location_str = `POINT(${values.latitude} ${values.longitude})`;
    let photospotInfo: any = { name: values.name, description: values?.description, location: location_str, draft: values?.draft, photo_paths: []} 
    formData.append("photospot_info",JSON.stringify(photospotInfo));
    formData.append("photospot_pictures",values.photospot_pictures[0]);
    photospotInfo.id = -1
    photospotInfo.photo_paths = [];    
    await refreshPhotospots(createPhotospotMutation(formData, photospots), createPhotospotOptions(photospotInfo, photospots));
  }

  const updateFormSchema = z.object({
    updateId: z.coerce.number({required_error: "Please select a photospot to update via id"}),
    updateName: z.string().min(2).max(50).optional(),
    updateDescription: z.string().optional(),
    updatePhotospot_pictures : z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    ).optional(),
    updateLatitude: z.coerce.number().gt(-90, {message:"latitude is too small" }).lt(90, {message:"latitude is too big" }).optional(),
    updateLongitude: z.coerce.number().gt(-180, {message: "longitude is too small"}).lt(180, {message:"longitude is too big"}).optional(),
    updateDraft:z.boolean().default(false).optional(),
  })
  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      updateId: undefined,
      updateName: undefined,
      updateDescription: undefined,
      updatePhotospot_pictures: undefined,
      updateLatitude: undefined,
      updateLongitude: undefined,
      updateDraft: false
    },
    mode: 'onChange',
  });
  const getUpdateInfo = (values: z.infer<typeof updateFormSchema>) => {
    let out: any = {};
    if(values.updateName){
      out.name = values.updateName
    }
    if(values.updateDescription){
      out.description = values.updateDescription
    }
    if(values.updateLatitude && values.updateLongitude){
      const location_str = `POINT(${values.updateLatitude} ${values.updateLongitude})`;
      out.location = location_str 
    }
    if(values.updateDraft){
      out.draft = values.updateDraft
    }
    return out;
  }
  const handleUpdate = async (values: z.infer<typeof updateFormSchema>) => {
    console.log('update photospot',JSON.stringify(values));
    let formData = new FormData();
    const updateTime = Date.now();
    formData.append('update_time', String(updateTime));
    formData.append("id", String(values.updateId))
    //create object with entries for update
    let photospotInfo: any = getUpdateInfo(values);
    if(Object.entries(photospotInfo).length >0){
      formData.append("photospot_info",JSON.stringify(photospotInfo));
    }
    if(values.updatePhotospot_pictures){
      formData.append("photospot_pictures",values.updatePhotospot_pictures[0]);
    }
    photospotInfo.id = values.updateId;
    photospotInfo.photo_paths = [];
    console.log('updating: ', formData);
    await refreshPhotospots(updatePhotospotMutation(formData, photospots), updatePhotospotOptions( photospotInfo, photospots));
  }

    const handleDelete = async (id: number) => {
      // await refreshPhotospots(deletePhotospotMutation(id, photolists), deletePhotospotOptions(id, photolists));
    }

    // const handleUpdate = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    //   e.preventDefault();
    //   const photolist = {id: id, name: name2, description: description2, }
    //   const photospots_ar =  photospots2.split(`,`).map(x => Number(x));
    //   await refreshPhotolists(updatePhotolistMutation(id, photolist, photolists, photospots_ar), updatePhotolistOptions(id, photolist ,photolists));
    // }

    // const handleSearchById = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    //   e.preventDefault();
    //   if(photolistById){
    //     await getPhotolistById({id: photolistById});
    //     console.log(photolistByIdInfo)
    //   }
    //   else{
    //     console.log('please enter id before searching');
    //   }
    // }

    // const handleSearchByName = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    //   e.preventDefault();
    //   if(photolistByName){
    //     await getPhotolistByName({search_string: photolistByName});
    //     console.log(photolistByNameResults);
    //   }
    //   else{
    //     console.log('please enter name before searching');
    //   }
    // }

    // const handleGetPhotolistsPhotospots = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    //   e.preventDefault();
    //   if(photolistsPhotospotsId){
    //     await getPhotolistsFromPhotospots({id: photolistsPhotospotsId});
    //     console.log(photolistsPhotospotsResults);
    //   }
    //   else{
    // }
   
    if(error){
      return <h1>error: {error.message}</h1>
    }
    if(isLoading){
      return <Loading/>
    }
    return(
      <div>
    <Tabs defaultValue="create" className="w-[700px]">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="update">Update</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="delete">Delete</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
       <Card>
          <CardHeader>
            <CardTitle>Create Photospot</CardTitle>
            <CardDescription>
             Add a new photospot with info below 
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-8">
        <FormField
          control={createForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
               Name for photospot 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={createForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="why is it a good location?" {...field} />
              </FormControl>
              <FormDescription>
                Tells us a bit about the location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={createForm.control}
          name="photospot_pictures"
          render={({ field: {onChange}, ...field }) => (
            <FormItem>
              <FormLabel>Photos</FormLabel>
              <FormControl>
                <Input {...field} type="file" onChange={(e) => {onChange(e.target.files)}}/>
              </FormControl>
              <FormDescription>
                Upload pictures from the spot
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       
         <FormField
          control={createForm.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>
                should be between -180, 180
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={createForm.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input {...field} type="number"  />
              </FormControl>
              <FormDescription>
                should be between -90,90
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          control={createForm.control}
          name="draft"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel htmlFor="draft" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Draft:
              </FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit">Create</Button>
         </form>
          </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="update">
      <Card>
          <CardHeader>
            <CardTitle>Update Photospots</CardTitle>
            <CardDescription>
             update a photospot via id 
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...updateForm}>
      <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-8">
      <FormField
          control={updateForm.control}
          name="updateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>
               ID for photospot 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={updateForm.control}
          name="updateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>
               Name for photospot 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={updateForm.control}
          name="updateDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="why is it a good location?" {...field} />
              </FormControl>
              <FormDescription>
                Tells us a bit about the location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={updateForm.control}
          name="updatePhotospot_pictures"
          render={({ field: {onChange}, ...field }) => (
            <FormItem>
              <FormLabel>Photos</FormLabel>
              <FormControl>
                <Input {...field} type="file" onChange={(e) => { console.log('updated file',e.target.files); onChange(e.target.files)}}/>
              </FormControl>
              <FormDescription>
                Upload pictures from the spot
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       
         <FormField
          control={updateForm.control}
          name="updateLatitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>
                should be between -180, 180
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={updateForm.control}
          name="updateLongitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input {...field} type="number"  />
              </FormControl>
              <FormDescription>
                should be between -90,90
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          control={updateForm.control}
          name="updateDraft"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel htmlFor="draft" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Draft:
              </FormLabel>
              <FormControl>
                <Checkbox  id="draft"  checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit">Save Changes</Button>
         </form>
          </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="search">
      <Card>
          <CardHeader>
            <CardTitle>Search for a photospot here</CardTitle>
            <CardDescription>
              Search for photospots using the filters below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          </CardContent>
          <CardFooter>
            <Button>Search</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="delete">
        <Card>
          <CardHeader>
            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Delete a photospot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
          {
          photospots ? photospots.map(photospot=> {
            return <div key={photospot.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photospot.id}>ID: {photospot.id}, Name: {photospot.name}</h1>
              <Button disabled={photospot.id === -1} onClick={()=>handleDelete(photospot.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        }
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
   <PhotospotGrid photospots={photospots}/> 

        {/* <form >
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
      {
          photolistByIdInfo && <h2>photospot info: {JSON.stringify(photolistByIdInfo)}</h2>
        }
        <form>
        <div className="mb-6">
            <label htmlFor="searchById" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photolist id:</label>
            <input type="number" onChange={(e)=>setPhotolistById(Number(e.target.value))} id="searchById" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="id" required/>
          </div>
          <button type="submit" onClick={(e)=>handleSearchById(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form> */}
    </div>
    );
}


