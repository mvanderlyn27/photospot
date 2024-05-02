"use client"
import useSWR from "swr";
import { Photolist, PhotolistInput } from "../../types/photospotTypes"
import Loading from "../Loading";
import { MouseEvent, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
// import { searchById, searchByLocation, searchByName, searchByRating, searchByTime } from "@/app/api/photolists/helpers/optimisticMutationHelpers";
import { fetcher } from "@/app/swr-provider";
import useSWRMutation from 'swr/mutation'
import { FaPlus, FaEdit, FaSearch, FaTrashAlt, FaList, FaCalendar } from "react-icons/fa";
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
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils"
import { format } from "date-fns"
/*Things to test
    Update data w/ photolist info
    search w/ filters
        search by rating
        search by "hot'"
      search within a box
*/

export default function PhotolistTests() {
  //STATE COMPONENT STATE
  const { data: photolists, error, isLoading, mutate: refreshPhotolists } = useSWR<Photolist[], { error: PostgrestError, message: number }, any>("/api/photolists/", fetcher);
  // const { data: photolistsByName, trigger: searchPhotolistsByName}: {data: Photolist[] | undefined, trigger: any} = useSWRMutation('/api/photolists/search/byName', searchByName);
  // const { data: photolistsById, trigger: searchPhotolistsById}: {data: Photolist[] | undefined, trigger: any} = useSWRMutation('/api/photolists/search/byId', searchById);
  // // const { data: photolistsByLocation, trigger: searchPhotolistsByLocation}: {data: Photolist[] | undefined, trigger: any} = useSWRMutation('/api/photolists/search/byLocation', searchByLocation);
  // const { data: photolistsByTime, trigger: searchPhotolistsByTime}: {data: Photolist[] | undefined, trigger: any} = useSWRMutation('/api/photolists/search/byTime', searchByTime);
  // const { data: photolistsByRating, trigger: searchPhotolistsByRating}: {data: Photolist[] | undefined, trigger: any} = useSWRMutation('/api/photolists/search/byRating', searchByRating);

  //FORM VALIDATION SECTION
  const MAX_FILE_SIZE = 5242880; //5MB
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const createFormSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string(),
    photolist_pictures: z
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
    photospots: z.string(),
    private: z.boolean().default(false).optional(),
  })
  const createForm = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      description: "",
      photolist_pictures: undefined,
      photospots: "",
      private: false
    },
    mode: 'onChange',
  });

  const handleCreate = async (values: z.infer<typeof createFormSchema>) => {
    console.log('create new photolist', JSON.stringify(values));
    console.log('photos', values.photolist_pictures);
    let formData = new FormData();
    const photospot_ar = values.photospots.replace(' ', '').split(',');
    let photolistInfo: any = { name: values.name, description: values?.description, private: values?.private }
    formData.append("photolist_info", JSON.stringify(photolistInfo));
    formData.append("photolist_pictures", values.photolist_pictures[0]);
    formData.append('photospot_info', JSON.stringify(photospot_ar));
    photolistInfo.id = -1
    photolistInfo.photo_paths = [];
    await fetch('/api/photolists/create', { method: "POST", body: formData });
    await refreshPhotolists(); //createPhotolistMutation(formData, photolists), createPhotolistOptions(photolistInfo, photolists));
  }

  const updateFormSchema = z.object({
    updateId: z.coerce.number({ required_error: "Please select a photolist to update via id" }),
    updateName: z.string().min(2).max(50).optional(),
    updateDescription: z.string().optional(),
    updatephotolist_pictures: z
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
    photospots: z.string().optional(),
    updatePrivate: z.boolean().default(false).optional(),
  })
  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      updateId: undefined,
      updateName: undefined,
      updateDescription: undefined,
      updatephotolist_pictures: undefined,
      photospots: "",
      updatePrivate: false
    },
    mode: 'onChange',
  });
  const getUpdateInfo = (values: z.infer<typeof updateFormSchema>) => {
    let out: any = {};
    if (values.updateName) {
      out.name = values.updateName
    }
    if (values.updateDescription) {
      out.description = values.updateDescription
    }
    if (values.updatePrivate) {
      out.private = values.updatePrivate
    }
    return out;
  }
  const handleUpdate = async (values: z.infer<typeof updateFormSchema>) => {
    console.log('update photolist', JSON.stringify(values));
    let formData = new FormData();
    const updateTime = Date.now();
    formData.append('update_time', String(updateTime));
    formData.append("id", String(values.updateId))
    //create object with entries for update
    let photolistInfo: any = getUpdateInfo(values);
    if (Object.entries(photolistInfo).length > 0) {
      formData.append("photolist_info", JSON.stringify(photolistInfo));
    }
    if (values.photospots) {
      const photospot_ar = values.photospots.replace(' ', '').split(',');
      console.log('photospot_ar', photospot_ar);
      formData.append('photospot_info', JSON.stringify(photospot_ar));
    }
    if (values.updatephotolist_pictures) {
      formData.append("photolist_pictures", values.updatephotolist_pictures[0]);
    }
    photolistInfo.id = values.updateId;
    photolistInfo.photo_paths = [];
    console.log('updating: ', formData);
    await fetch('/api/photolists/update', { method: "POST", body: formData });
    await refreshPhotolists()//updatephotolistMutation(formData, photolists), updatephotolistOptions( photolistInfo, photolists));
  }

  const handleDelete = async (id: number) => {
    await refreshPhotolists()//deletephotolisttMutation(id, photolists), deletephotolistOptions(id, photolists));
  }

  const searchByIdFormSchema = z.object({
    searchId: z.coerce.number({ required_error: "Please select a photolist to update via id" }),
  });
  const searchByIdForm = useForm<z.infer<typeof searchByIdFormSchema>>({
    resolver: zodResolver(searchByIdFormSchema),
    defaultValues: {
      searchId: undefined,
    },
    mode: 'onChange',
  });
  const handleSearchById = async (values: z.infer<typeof searchByIdFormSchema>) => {
    // await searchPhotolistsById({id: values.searchId});
  }

  const searchByNameFormSchema = z.object({
    searchName: z.string().min(2).max(50),
  });
  const searchByNameForm = useForm<z.infer<typeof searchByNameFormSchema>>({
    resolver: zodResolver(searchByNameFormSchema),
    defaultValues: {
      searchName: undefined,
    },
    mode: 'onChange',
  });
  const handleSearchByName = async (values: z.infer<typeof searchByNameFormSchema>) => {
    console.log('searching by name', values.searchName);
    // await searchPhotolistsByName({name: values.searchName });
  }

  // const searchByLocationFormSchema = z.object({
  //   searchLatitude: z.coerce.number().gt(-90, {message:"latitude is too small" }).lt(90, {message:"latitude is too big" }),
  //   searchLongitude: z.coerce.number().gt(-180, {message: "longitude is too small"}).lt(180, {message:"longitude is too big"}),
  // });
  // const searchByLocationForm = useForm<z.infer<typeof searchByLocationFormSchema>>({
  //   resolver: zodResolver(searchByLocationFormSchema),
  //   defaultValues: {
  //     searchLatitude: undefined,
  //     searchLongitude: undefined,
  //   },
  //   mode: 'onChange',
  // }); 
  // const handleSearchByLocation = async (values: z.infer<typeof searchByLocationFormSchema>) => {
  //   await searchPhotolistsByLocation({lat: values.searchLatitude, lng: values.searchLongitude, maxDistance: 500 });
  // }

  const searchByTimeFormSchema = z.object({
    start: z.date({ required_error: "A date of birth is required.", }),
    end: z.date({ required_error: "A date of birth is required.", }),
    ascending: z.boolean()
  }).refine(({ start, end }) => { if (end) { return start <= end } else { return true } }, "invalid range, from is greater than thru");
  const searchByTimeForm = useForm<z.infer<typeof searchByTimeFormSchema>>({
    resolver: zodResolver(searchByTimeFormSchema),
    defaultValues: {
      start: undefined,
      end: undefined,
      ascending: true,
    },
    mode: 'onChange',
  });
  const handleSearchByTime = async (values: z.infer<typeof searchByTimeFormSchema>) => {
    // await searchPhotolistsByTime({start: values.start, end: values.end, ascending: values.ascending});
  }
  const searchByRatingFormSchema = z.object({
    ascending: z.boolean()
  });
  const searchByRatingForm = useForm<z.infer<typeof searchByRatingFormSchema>>({
    resolver: zodResolver(searchByRatingFormSchema),
    defaultValues: {
      ascending: false,
    },
    mode: 'onChange',
  });
  const handleSearchByRating = async (values: z.infer<typeof searchByRatingFormSchema>) => {
    // await searchPhotolistsByRating({ ascending: values.ascending});
  }

  if (error) {
    return <h1>error: {error.message}</h1>
  }
  if (isLoading) {
    return <Loading />
  }
  return (
    <div>
      <Tabs defaultValue="list" className="w-[700px]">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="update">Update</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>List photolists</CardTitle>
              <CardDescription>
                View all photolists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {
                photolists ? photolists.map(photolist => {
                  return (<div key={photolist.id} className="flex w-full max-w-sm items-center space-x-2">
                    <Image key={photolist.id} width={100} height={100} className="" src={photolist?.photo_paths ? photolist.photo_paths[0] : ""} alt={photolist.id ? photolist.id + "" : "no pic"} />
                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photolist.id}>ID: {photolist.id}, Name: {photolist.name}</h1>
                  </div>)
                }) : <h1>no data yet</h1>
              }
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create photolist</CardTitle>
              <CardDescription>
                Add a new photolist with info below
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
                          Name for photolist
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
                    name="photolist_pictures"
                    render={({ field: { onChange }, ...field }) => (
                      <FormItem>
                        <FormLabel>Photos</FormLabel>
                        <FormControl>
                          <Input {...field} type="file" onChange={(e) => { onChange(e.target.files) }} />
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
                    name="photospots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photospots:</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Should be comma seperated id's of photospots
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
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
              <CardTitle>Update photolists</CardTitle>
              <CardDescription>
                update a photolist via id
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
                          ID for photolist
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
                          Name for photolist
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
                    name="updatephotolist_pictures"
                    render={({ field: { onChange }, ...field }) => (
                      <FormItem>
                        <FormLabel>Photos</FormLabel>
                        <FormControl>
                          <Input {...field} type="file" onChange={(e) => { console.log('updated file', e.target.files); onChange(e.target.files) }} />
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
                    name="photospots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photospots</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          comma seperated list of photospots id's
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
                          <Checkbox id="private" checked={field.value} onCheckedChange={field.onChange} />
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
              <CardTitle>Search for a photolist here</CardTitle>
              <CardDescription>
                Search for photolists using the filters below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Tabs defaultValue="title" className="w-[600px]">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="title">Title</TabsTrigger>
                  <TabsTrigger value="id">By ID</TabsTrigger>
                  {/* <TabsTrigger value="location">Location</TabsTrigger> */}
                  <TabsTrigger value="time">Time</TabsTrigger>
                  <TabsTrigger value="rating">Rating</TabsTrigger>
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
                              Name for photolist
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Search</Button>
                    </form>
                  </Form>
                  {/* {
          photolistsByName ? photolistsByName.map(photolist=> {
            return <div key={photolist.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photolist.id}>ID: {photolist.id}, Name: {photolist.name}</h1>
              <Button disabled={photolist.id === -1} onClick={()=>handleDelete(photolist.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        } */}
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
                              ID for photolist
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Search</Button>
                    </form>
                  </Form>
                  {/* {
          photolistsById ? photolistsById.map(photolist=> {
            return <div key={photolist.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photolist.id}>ID: {photolist.id}, Name: {photolist.name}</h1>
              <Button disabled={photolist.id === -1} onClick={()=>handleDelete(photolist.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        } */}
                </TabsContent>
                {/* <TabsContent value="location">
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
               Latitude for photolist 
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
               Longitude for photolist 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
        </form>
        </Form>
        {
          photolistsByLocation ? photolistsByLocation.map(photolist=> {
            return <div key={photolist.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photolist.id}>ID: {photolist.id}, Name: {photolist.name}</h1>
              <Button disabled={photolist.id === -1} onClick={()=>handleDelete(photolist.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        }
      </TabsContent> */}
                <TabsContent value="time">
                  <Form {...searchByTimeForm}>
                    <form onSubmit={searchByTimeForm.handleSubmit(handleSearchByTime)} className="space-y-8">

                      <FormField
                        control={searchByTimeForm.control}
                        name="start"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start date</FormLabel>
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
                            <FormLabel>End date</FormLabel>
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
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Search</Button>
                    </form>
                  </Form>
                  {/* {
          photolistsByTime ? photolistsByTime.map(photolist=> {
            return <div key={photolist.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photolist.id}>ID: {photolist.id}, Name: {photolist.name}</h1>
              <Button disabled={photolist.id === -1} onClick={()=>handleDelete(photolist.id)}>Delete</Button>
              </div>
          }) : <h1>no data yet</h1> 
        } */}
                </TabsContent>
                <TabsContent value="rating">
                  <Form {...searchByIdForm}>
                    <form onSubmit={searchByRatingForm.handleSubmit(handleSearchByRating)} className="space-y-8">
                      <FormField
                        control={searchByRatingForm.control}
                        name="ascending"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel htmlFor="private" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Lowest to highest:
                            </FormLabel>
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>)} />
                      <Button type="submit">Search</Button>
                    </form>
                  </Form>
                  {/* {
          photolistsByRating ? photolistsByRating.map(photolist=> {
            return <div key={photolist.id} className="flex w-full max-w-sm items-center space-x-2">
              <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photolist.id}>ID: {photolist.id}, Rating: {photolist.rating_average ? photolist.rating_average : "no rating yet"}</h1>
              </div>
          }) : <h1>no data yet</h1> 
        } */}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="delete">
          <Card>
            <CardHeader>
              <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Delete a photolist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {
                photolists ? photolists.map(photolist => {
                  return <div key={photolist.id} className="flex w-full max-w-sm items-center space-x-2">
                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photolist.id}>ID: {photolist.id}, Name: {photolist.name}</h1>
                    <Button disabled={photolist.id === -1} onClick={() => handleDelete(photolist.id)}>Delete</Button>
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


