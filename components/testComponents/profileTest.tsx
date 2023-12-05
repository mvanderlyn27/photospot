"use client"
import useSWR from "swr";
import {Photolist, PhotolistInput, Photospot, PublicProfile} from "../../types/photospotTypes"
import Loading from "../Loading";
import { MouseEvent, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { createPhotospotMutation, createPhotospotOptions, deletePhotospotOptions, deletePhotospottMutation, searchById, searchByLocation, searchByName, searchByTime, updatePhotospotMutation, updatePhotospotOptions } from "@/app/api/photospots/helpers/optimisticMutationHelpers";
import { fetcher } from "@/app/swr-provider";
import useSWRMutation from 'swr/mutation'
import { FaPlus, FaEdit, FaSearch, FaTrashAlt, FaList, FaCalendar} from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import PhotospotGrid from "../PhotoSpotGrid";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils"
import { format } from "date-fns"
/*Things to test
    Create test user
    Update data
        - update profile pic
        - update private/public info
    Load public profile info
    Load logged in users private info
    search w/ filters
        - search by username
*/

export default function ProfileTests(){
  //STATE COMPONENT STATE
  const { data: profiles, error, isLoading, mutate: refreshPublicProfile} = useSWR<PublicProfile[], {error:PostgrestError, message:number}, any>("/api/profiles/" , fetcher);
  const { data: privateProfile, error:privateError, isLoading:privateIsLoading, mutate: refreshPrivateProfile } = useSWR<PublicProfile, {error:PostgrestError, message:number}, any>("/api/profiles/myProfile/" , fetcher);
  const { data: photospotsByName, trigger: searchPhotospotsByName}: {data: Photospot[], trigger: any} = useSWRMutation('/api/photospots/search/byName', searchByName);
  const { data: photospotsById, trigger: searchPhotospotsById}: {data: Photospot[], trigger: any} = useSWRMutation('/api/photospots/search/byId', searchById);
  const { data: photospotsByLocation, trigger: searchPhotospotsByLocation}: {data: Photospot[], trigger: any} = useSWRMutation('/api/photospots/search/byLocation', searchByLocation);
  const { data: photospotsByTime, trigger: searchPhotospotsByTime}: {data: Photospot[], trigger: any} = useSWRMutation('/api/photospots/search/byTime', searchByTime);

//FORM VALIDATION SECTION
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
    private: z.boolean().default(false).optional(),
  })
//   const createForm = useForm<z.infer<typeof createFormSchema>>({
//     resolver: zodResolver(createFormSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       photospot_pictures: undefined,
//       latitude: undefined,
//       longitude: undefined,
//       private: false
//     },
//     mode: 'onChange',
//   });

//   const handleCreate = async (values: z.infer<typeof createFormSchema>) => {
//     console.log('create new photospot',JSON.stringify(values));
//     console.log('photos',values.photospot_pictures);
//     let formData = new FormData();
//     const location_str = `POINT(${values.latitude} ${values.longitude})`;
//     let photospotInfo: any = { name: values.name, description: values?.description, location: location_str, private: values?.private, photo_paths: []} 
//     formData.append("photospot_info",JSON.stringify(photospotInfo));
//     formData.append("photospot_pictures",values.photospot_pictures[0]);
//     photospotInfo.id = -1
//     photospotInfo.photo_paths = [];    
//     await refreshPhotospots(createPhotospotMutation(formData, profiles), createPhotospotOptions(photospotInfo, profiles));
//   }

//   const updateFormSchema = z.object({
//     updateId: z.coerce.number({required_error: "Please select a photospot to update via id"}),
//     updateName: z.string().min(2).max(50).optional(),
//     updateDescription: z.string().optional(),
//     updatePhotospot_pictures : z
//     .custom<FileList>((val) => val instanceof FileList, "Required")
//     .refine((files) => files.length > 0, `Required`)
//     .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
//     .refine(
//       (files) =>
//         Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
//       `Each file size should be less than 5 MB.`
//     )
//     .refine(
//       (files) =>
//         Array.from(files).every((file) =>
//         ACCEPTED_IMAGE_TYPES.includes(file.type)
//         ),
//       "Only these types are allowed .jpg, .jpeg, .png and .webp"
//     ).optional(),
//     updateLatitude: z.coerce.number().gt(-90, {message:"latitude is too small" }).lt(90, {message:"latitude is too big" }).optional(),
//     updateLongitude: z.coerce.number().gt(-180, {message: "longitude is too small"}).lt(180, {message:"longitude is too big"}).optional(),
//     updatePrivate:z.boolean().default(false).optional(),
//   })
//   const updateForm = useForm<z.infer<typeof updateFormSchema>>({
//     resolver: zodResolver(updateFormSchema),
//     defaultValues: {
//       updateId: undefined,
//       updateName: undefined,
//       updateDescription: undefined,
//       updatePhotospot_pictures: undefined,
//       updateLatitude: undefined,
//       updateLongitude: undefined,
//       updatePrivate: false
//     },
//     mode: 'onChange',
//   });
//   const getUpdateInfo = (values: z.infer<typeof updateFormSchema>) => {
//     let out: any = {};
//     if(values.updateName){
//       out.name = values.updateName
//     }
//     if(values.updateDescription){
//       out.description = values.updateDescription
//     }
//     if(values.updateLatitude && values.updateLongitude){
//       const location_str = `POINT(${values.updateLatitude} ${values.updateLongitude})`;
//       out.location = location_str 
//     }
//     if(values.updatePrivate){
//       out.private = values.updatePrivate
//     }
//     return out;
//   }
//   const handleUpdate = async (values: z.infer<typeof updateFormSchema>) => {
//     console.log('update photospot',JSON.stringify(values));
//     let formData = new FormData();
//     const updateTime = Date.now();
//     formData.append('update_time', String(updateTime));
//     formData.append("id", String(values.updateId))
//     //create object with entries for update
//     let photospotInfo: any = getUpdateInfo(values);
//     if(Object.entries(photospotInfo).length >0){
//       formData.append("photospot_info",JSON.stringify(photospotInfo));
//     }
//     if(values.updatePhotospot_pictures){
//       formData.append("photospot_pictures",values.updatePhotospot_pictures[0]);
//     }
//     photospotInfo.id = values.updateId;
//     photospotInfo.photo_paths = [];
//     console.log('updating: ', formData);
//     await refreshPhotospots(updatePhotospotMutation(formData, photospots), updatePhotospotOptions( photospotInfo, photospots));
//   }

  const handleDelete = async (id: number) => {
    // await refreshPhotospots(deletePhotospottMutation(id, profiles), deletePhotospotOptions(id, profiles));
    console.log('delete');
  }
  
//   const searchByIdFormSchema = z.object({
//     searchId: z.coerce.number({required_error: "Please select a photospot to update via id"}),
//   });
//   const searchByIdForm = useForm<z.infer<typeof searchByIdFormSchema>>({
//     resolver: zodResolver(searchByIdFormSchema),
//     defaultValues: {
//       searchId: undefined,
//     },
//     mode: 'onChange',
//   });  
//   const handleSearchById = async (values: z.infer<typeof searchByIdFormSchema>) => {
//     await searchPhotospotsById({id: values.searchId});
//   }
   
//   const searchByNameFormSchema = z.object({
//     searchName: z.string().min(2).max(50),
//   });
//   const searchByNameForm = useForm<z.infer<typeof searchByNameFormSchema>>({
//     resolver: zodResolver(searchByNameFormSchema),
//     defaultValues: {
//       searchName: undefined,
//     },
//     mode: 'onChange',
//   }); 
//   const handleSearchByName = async (values: z.infer<typeof searchByNameFormSchema>) => {
//     console.log('searching by name', values.searchName);
//     await searchPhotospotsByName({name: values.searchName });
//   }
 
//   const searchByLocationFormSchema = z.object({
//     searchLatitude: z.coerce.number().gt(-90, {message:"latitude is too small" }).lt(90, {message:"latitude is too big" }),
//     searchLongitude: z.coerce.number().gt(-180, {message: "longitude is too small"}).lt(180, {message:"longitude is too big"}),
//   });
//   const searchByLocationForm = useForm<z.infer<typeof searchByLocationFormSchema>>({
//     resolver: zodResolver(searchByLocationFormSchema),
//     defaultValues: {
//       searchLatitude: undefined,
//       searchLongitude: undefined,
//     },
//     mode: 'onChange',
//   }); 
//   const handleSearchByLocation = async (values: z.infer<typeof searchByLocationFormSchema>) => {
//     await searchPhotospotsByLocation({lat: values.searchLatitude, lng: values.searchLongitude, maxDistance: 500 });
//   }

//   const searchByTimeFormSchema = z.object({
//     start: z.date({ required_error: "A date of birth is required.", }),
//     end: z.date({ required_error: "A date of birth is required.", }),
//     ascending: z.boolean()
//   }).refine(({start, end}) => {if(end){return start <= end} else {return true}}, "invalid range, from is greater than thru");
//   const searchByTimeForm = useForm<z.infer<typeof searchByTimeFormSchema>>({
//     resolver: zodResolver(searchByTimeFormSchema),
//     defaultValues: {
//       start: undefined,
//       end: undefined,
//       ascending: true,
//     },
//     mode: 'onChange',
//   }); 
//   const handleSearchByTime = async (values: z.infer<typeof searchByTimeFormSchema>) => {
//     await searchPhotospotsByTime({start: values.start, end: values.end, ascending: values.ascending});
//   }

    if(error){
      return <h1>error: {error.message}</h1>
    }
    if(isLoading){
      return <Loading/>
    }
    return(
      <div>
    <Tabs defaultValue="list" className="w-[700px]">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="list">List</TabsTrigger>
        <TabsTrigger value="privateProfile">My Profile</TabsTrigger>
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="update">Update</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="delete">Delete</TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <Card>
          <CardHeader>
            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">List of Public Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
          {
          profiles ? profiles.map(profile=> {
            return <div key={profile.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={profile.id}>ID: {profile.id}, Name: {profile.username}</h1>
              </div>
          }) : <h1>no data yet</h1> 
        }
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="privateProfile">
        <Card>
          <CardHeader>
            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">List of Public Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
          {
          privateProfile ? <div key={privateProfile.id} className="flex w-full max-w-sm items-center space-x-2">
            <Image key={privateProfile.id} width={100} height={100} className= "" src={privateProfile.profile_pic_url ? privateProfile.profile_pic_url : ""}  alt={privateProfile.id ? privateProfile.id+"" : "no pic"}/>
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={privateProfile.id}>ID: {privateProfile.id}, Name: {privateProfile.username}</h1>
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={privateProfile.id+"2"}>{JSON.stringify(privateProfile)}</h1>
            </div> : <h1>no data yet</h1> 
        }
          </CardContent>
        </Card>
      </TabsContent>
      {/* <TabsContent value="create">
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
          name="private"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel htmlFor="private" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Private:
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
                should be between -90, 90 
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
                should be between -180, 180
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          control={updateForm.control}
          name="updatePrivate"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel htmlFor="private" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Private:
              </FormLabel>
              <FormControl>
                <Checkbox  id="private"  checked={field.value} onCheckedChange={field.onChange}/>
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
          <Tabs defaultValue="title" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="title">Title</TabsTrigger>
        <TabsTrigger value="id">By ID</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="time">Time</TabsTrigger>
      </TabsList> 
      <TabsContent value="title">
      <Form {...searchByNameForm}>
      <form onSubmit={searchByNameForm.handleSubmit(handleSearchByName)} className="space-y-8">
        <FormField
          control={searchByNameForm.control}
          name="searchName"
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
        <Button type="submit">Search</Button>
        </form>
        </Form>
        {
          photospotsByName ? photospotsByName.map(photospot=> {
            return <div key={photospot.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photospot.id}>ID: {photospot.id}, Name: {photospot.name}</h1>
              <Button disabled={photospot.id === -1} onClick={()=>handleDelete(photospot.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        }
      </TabsContent>
      <TabsContent value="id">
      <Form {...searchByIdForm}>
      <form onSubmit={searchByIdForm.handleSubmit(handleSearchById)} className="space-y-8">
        <FormField
          control={searchByIdForm.control}
          name="searchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="number" placeholder="ID" {...field} />
              </FormControl>
              <FormDescription>
               ID for photospot 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
        </form>
        </Form>
        {
          photospotsById ? photospotsById.map(photospot=> {
            return <div key={photospot.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photospot.id}>ID: {photospot.id}, Name: {photospot.name}</h1>
              <Button disabled={photospot.id === -1} onClick={()=>handleDelete(photospot.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        }
      </TabsContent>
      <TabsContent value="location">
      <Form {...searchByLocationForm}>
      <form onSubmit={searchByLocationForm.handleSubmit(handleSearchByLocation)} className="space-y-8">
        <FormField
          control={searchByLocationForm.control}
          name="searchLatitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input placeholder="latitude" {...field} />
              </FormControl>
              <FormDescription>
               Latitude for photospot 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={searchByLocationForm.control}
          name="searchLongitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input placeholder="longitude" {...field} />
              </FormControl>
              <FormDescription>
               Longitude for photospot 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
        </form>
        </Form>
        {
          photospotsByLocation ? photospotsByLocation.map(photospot=> {
            return <div key={photospot.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photospot.id}>ID: {photospot.id}, Name: {photospot.name}</h1>
              <Button disabled={photospot.id === -1} onClick={()=>handleDelete(photospot.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        }
      </TabsContent>
      <TabsContent value="time">
      <Form {...searchByTimeForm}>
      <form onSubmit={searchByTimeForm.handleSubmit(handleSearchByTime)} className="space-y-8">
        
         <FormField
          control={searchByTimeForm.control}
          name="start"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <FaCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Start date of search
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={searchByTimeForm.control}
          name="end"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <FaCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                End date of search
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={searchByTimeForm.control}
          name="ascending"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel htmlFor="private" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ascending:
              </FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
        </form>
        </Form>
        {
          photospotsByTime ? photospotsByTime.map(photospot=> {
            return <div key={photospot.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photospot.id}>ID: {photospot.id}, Name: {photospot.name}</h1>
              <Button disabled={photospot.id === -1} onClick={()=>handleDelete(photospot.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        }
      </TabsContent>
      </Tabs>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </TabsContent> */}
      <TabsContent value="delete">
        <Card>
          <CardHeader>
            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Delete a user</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
          {
          profiles ? profiles.map(profile=> {
            return <div key={profile.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={profile.id}>ID: {profile.id}, Name: {profile.username}</h1>
              <Button disabled={profile.id === -1} onClick={()=>handleDelete(profile.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        }
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
    );
}


