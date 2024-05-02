"use client"
import useSWR from "swr";
import { Photolist, PhotolistInput, Photospot, PhotospotReview, PublicProfile, RatingStat } from "../../types/photospotTypes"
import Loading from "../Loading";
import { MouseEvent, useEffect, useState } from "react";
import { PostgrestError, User } from "@supabase/supabase-js";
// import { searchById, searchByUsername } from "@/app/api/profiles/helpers/optimisticMutationHelpers";
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
import PhotospotGrid from "../PhotoSpotGrid";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { searchByPhotospot, searchByUser } from "@/app/api/photospotReviews/helpers/optimisticMutationHelpers";
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

export default function PhotospotReviewTests({ user }: { user: User }) {
    //GET USER INFO


    //STATE COMPONENT STATE
    const { data: reviews, error, isLoading, mutate: refreshMyReviews } = useSWR<PhotospotReview[], { error: PostgrestError, message: number }, any>("/api/photospotReviews/", fetcher);
    const { data: photospots, error: photospotError, isLoading: photospotLoading, mutate: refreshPhotospots } = useSWR<Photospot[], { error: PostgrestError, message: number }, any>("/api/photospots/", fetcher);
    //   const { data: reviewsByUser, trigger: searchReviewsByUser}: {data: PhotospotReview[], trigger: any} = useSWRMutation('/api/photospotReviews/search/byUser', searchByUser);
    //   const { data: reviewsByPhotospot, trigger: searchReviewsByPhotospot}: {data: PhotospotReview[], trigger: any} = useSWRMutation('/api/photospotReviews/search/byPhotospot', searchByPhotospot);
    //   const { data: averageRatingOfPhotospot, trigger: getRatingAverage}: {data: RatingStat, trigger: any} = useSWRMutation('/api/photospotReviews/rating/getAverage', searchByPhotospot);
    //   const { data: ratingCountOfPhotospot, trigger: getRatingCount}: {data: RatingStat, trigger: any} = useSWRMutation('/api/photospotReviews/rating/getCount', searchByPhotospot);

    //FORM VALIDATION SECTION
    const MAX_FILE_SIZE = 5242880; //5MB
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const createFormSchema = z.object({
        photospot_id: z.coerce.number(),
        rating: z.coerce.number().gte(0).lte(5),
        text: z.string(),
        photos: z
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
    })
    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            photospot_id: undefined,
            rating: undefined,
            text: undefined,
            photos: undefined
        },
        mode: 'onChange',
    });
    const handleCreate = async (values: z.infer<typeof createFormSchema>) => {
        const formData = new FormData();
        const id = user.id;
        const output: PhotospotReview = { photospot_id: values.photospot_id, created_by: id, rating: values.rating, text: values.text };
        formData.append('review_info', JSON.stringify(output));
        if (values.photos) {
            formData.append('timestamp', Date.now().toString());
            formData.append('photos', values.photos[0]);
        }
        const resp = await fetch('/api/photospotReviews/create', { method: 'POST', body: formData });
        await refreshMyReviews();
    }
    //   const handleCreateRandomReview = async () => {
    //     const resp = await fetch('/api/profiles/createTestAccountRandom', {method: 'POST'});
    //     await refreshPublicProfile();
    //   }

    const updateFormSchema = z.object({
        photospot_id: z.coerce.number(),
        rating: z.coerce.number().gte(0).lte(5).optional(),
        text: z.string().optional(),
        photos: z
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
    });
    const updateForm = useForm<z.infer<typeof updateFormSchema>>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            photospot_id: undefined,
            rating: undefined,
            text: undefined,
            photos: undefined
        },
        mode: 'onChange',
    });
    const getReviewUpdateInfo = (values: z.infer<typeof updateFormSchema>) => {
        let out: any = {};
        if (values.rating !== undefined && values.text !== "") {
            out.rating = values.rating
        }
        if (values.text !== undefined && values.text !== "") {
            out.text = values.text
        }
        return out;
    }
    const handleUpdate = async (values: z.infer<typeof updateFormSchema>) => {
        //need to update this properly
        console.log('update review', JSON.stringify(values));
        let formData = new FormData();
        formData.append('photospot_id', values.photospot_id.toString());
        formData.append('timestamp', Date.now().toString());
        //create object with entries for update
        let reviewInfo: any = getReviewUpdateInfo(values);
        if (Object.entries(reviewInfo).length > 0) {
            formData.append("review_info", JSON.stringify(reviewInfo));
        }
        if (values.photos) {
            formData.append("review_pictures", values.photos[0]);
        }
        const updateResponse = await fetch('/api/photospotReviews/update', { method: 'POST', body: formData });

        if (!updateResponse.ok) {
            console.log('error updating profile', updateResponse);
        }
        console.log('successful update', updateResponse);
        await refreshMyReviews();
    }
    const handleDelete = async (photospot_id: number) => {
        // await refreshPhotospots(deletePhotospottMutation(id, profiles), deletePhotospotOptions(id, profiles));
        const resp = await fetch('/api/photospotReviews/delete', { method: 'POST', body: JSON.stringify({ photospot_id: photospot_id }) });
        await refreshMyReviews();
    }
    const searchByPhotospotFormSchema = z.object({
        photospot_id: z.coerce.number({ required_error: "Please select a photospot to lookup reviews of via id" }),
    });
    const searchByPhotospotForm = useForm<z.infer<typeof searchByPhotospotFormSchema>>({
        resolver: zodResolver(searchByPhotospotFormSchema),
        defaultValues: {
            photospot_id: undefined,
        },
        mode: 'onChange',
    });
    const handleSearchByPhotospot = async (values: z.infer<typeof searchByPhotospotFormSchema>) => {
        console.log('searching by photospot', values.photospot_id);
        // await searchReviewsByPhotospot({photospot_id: values.photospot_id});
    }

    const searchByUserFormSchema = z.object({
        user_id: z.string(),
    });
    const searchByUserForm = useForm<z.infer<typeof searchByUserFormSchema>>({
        resolver: zodResolver(searchByUserFormSchema),
        defaultValues: {
            user_id: undefined,
        },
        mode: 'onChange',
    });
    const handleSearchByUser = async (values: z.infer<typeof searchByUserFormSchema>) => {
        console.log('searching by name', values.user_id);
        // await searchReviewsByUser({user_id: values.user_id});
    }

    const getRatingAverageFormSchema = z.object({
        photospot_id: z.coerce.number({ required_error: "Please select a photospot to lookup reviews of via id" }),
    });
    const getRatingAverageForm = useForm<z.infer<typeof getRatingAverageFormSchema>>({
        resolver: zodResolver(getRatingAverageFormSchema),
        defaultValues: {
            photospot_id: undefined,
        },
        mode: 'onChange',
    });
    const handleGetAverageRating = async (values: z.infer<typeof getRatingAverageFormSchema>) => {
        console.log('getting average for photospot', values.photospot_id);
        // await getRatingAverage({photospot_id: values.photospot_id});
    }
    const getRatingCountFormSchema = z.object({
        photospot_id: z.coerce.number({ required_error: "Please select a photospot to lookup reviews of via id" }),
    });
    const getRatingCountForm = useForm<z.infer<typeof getRatingCountFormSchema>>({
        resolver: zodResolver(getRatingCountFormSchema),
        defaultValues: {
            photospot_id: undefined,
        },
        mode: 'onChange',
    });
    const handlegetRatingCount = async (values: z.infer<typeof getRatingCountFormSchema>) => {
        console.log('getting count for  photospot', values.photospot_id);
        // await getRatingCount({photospot_id: values.photospot_id});
    }
    if (error || photospotError) {
        return <h1>error: {error?.message} photospot error: {photospotError?.message}</h1>
    }
    if (isLoading || photospotLoading) {
        return <Loading />
    }
    return (
        <div>
            <Tabs defaultValue="list" className="w-[700px]">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="list">My Reviews</TabsTrigger>
                    <TabsTrigger value="create">Create</TabsTrigger>
                    <TabsTrigger value="update">Update</TabsTrigger>
                    <TabsTrigger value="search">Search</TabsTrigger>
                    <TabsTrigger value="rating">Rating Stats</TabsTrigger>
                    <TabsTrigger value="delete">Delete</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">List of Public Users</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {
                                reviews ? reviews.map(review => {
                                    return <div key={review.created_by + ' ' + review.photospot_id} className="flex w-full max-w-sm items-center space-x-2">
                                        <Image key={review.created_by + ' ' + review.photospot_id} width={100} height={100} src={review.photo_paths ? review.photo_paths[0] : ""} alt={review.created_by ? review.created_by + "" : "no pic"} />
                                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={review.created_by + ' ' + review.photospot_id}>created by: {review.created_by}, content: {review.text}</h1>
                                    </div>
                                }) : <h1>no data yet</h1>
                            }
                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </TabsContent>
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
                                        name="photospot_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Photospot ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="id" type="number" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Email for test user
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rating</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="rating" type="number" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Number from 1-5
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Review Info</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="this spot was..." {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    What'd you think about this place
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="photos"
                                        render={({ field: { onChange }, ...field }) => (
                                            <FormItem>
                                                <FormLabel>Profile Picture</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="file" onChange={(e) => { console.log('updated file', e.target.files); onChange(e.target.files) }} />
                                                </FormControl>
                                                <FormDescription>
                                                    Upload pictures for your review
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit">Create</Button>
                                </form>
                            </Form>
                            <h1>Photospots:</h1>
                            {
                                photospots ? photospots.map(photospot => {
                                    return <div key={photospot.id} className="flex w-full max-w-sm items-center space-x-2">
                                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={photospot.id}>Id: {photospot.id}, Name: {photospot.name}</h1>
                                    </div>
                                }) : <h1>no data yet</h1>
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="update">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Profile</CardTitle>
                            <CardDescription>
                                update a your profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Form {...updateForm}>
                                <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-8">
                                    <FormField
                                        control={updateForm.control}
                                        name="photospot_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ID:</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ID" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    white photospot's review to update
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateForm.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rating:</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(1-5)" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    update old rating
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateForm.control}
                                        name="text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Text for review</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="review.." {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    text for review
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateForm.control}
                                        name="photos"
                                        render={({ field: { onChange }, ...field }) => (
                                            <FormItem>
                                                <FormLabel>Profile Picture</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="file" onChange={(e) => { console.log('updated file', e.target.files); onChange(e.target.files) }} />
                                                </FormControl>
                                                <FormDescription>
                                                    Update review pic
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Save Changes</Button>
                                </form>
                                {
                                    reviews ? reviews.map(review => {
                                        return <div key={review.created_by + ' ' + review.photospot_id} className="flex w-full max-w-sm items-center space-x-2">
                                            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={review.created_by + ' ' + review.photospot_id}>review info:  {JSON.stringify(review)} </h1>
                                        </div>
                                    }) : <h1>no data yet</h1>
                                }
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
                            <Tabs defaultValue="user" className="w-[600px]">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="user">By User</TabsTrigger>
                                    <TabsTrigger value="id">By ID</TabsTrigger>
                                </TabsList>
                                <TabsContent value="user">
                                    <Form {...searchByUserForm}>
                                        <form onSubmit={searchByUserForm.handleSubmit(handleSearchByUser)} className="space-y-8">
                                            <FormField
                                                control={searchByUserForm.control}
                                                name="user_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>User:</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="user id" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            select user ID to use
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit">Search</Button>
                                        </form>
                                    </Form>
                                    {/* {
        // reviewsByUser ? reviewsByUser.map(review=> {
        return <div key={review.created_by+' '+review.photospot_id} className="flex w-full max-w-sm items-center space-x-2">
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={review.created_by+' '+review.photospot_id}>Created By: {review.created_by}, Content: {review.text}, Rating: {review.rating}</h1>
            </div>
        }) : <h1>no data yet</h1> 
    } */}
                                </TabsContent>
                                <TabsContent value="id">
                                    <Form {...searchByPhotospotForm}>
                                        <form onSubmit={searchByPhotospotForm.handleSubmit(handleSearchByPhotospot)} className="space-y-8">
                                            <FormField
                                                control={searchByPhotospotForm.control}
                                                name="photospot_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ID" {...field} />
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
                                    {/* {
       reviewsByPhotospot ? reviewsByPhotospot.map(review=> {
        return <div key={review.created_by+' '+review.photospot_id} className="flex w-full max-w-sm items-center space-x-2">
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={review.created_by+' '+review.photospot_id}>Created By: {review.created_by}, Content: {review.text}, Rating: {review.rating}</h1>
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
                <TabsContent value="rating">
                    <Card>
                        <CardHeader>
                            <CardTitle>Find ratings for photospots based on photspot id</CardTitle>
                            <CardDescription>
                                Find stats using the options below
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Tabs defaultValue="average" className="w-[600px]">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="average">Average</TabsTrigger>
                                    <TabsTrigger value="count">Count</TabsTrigger>
                                </TabsList>
                                <TabsContent value="average">
                                    <Form {...getRatingAverageForm}>
                                        <form onSubmit={getRatingAverageForm.handleSubmit(handleGetAverageRating)} className="space-y-8">
                                            <FormField
                                                control={getRatingAverageForm.control}
                                                name="photospot_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Photospot ID:</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="photospot id" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            select photospot ID to use
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit">Search</Button>
                                        </form>
                                    </Form>
                                    {/* {
        averageRatingOfPhotospot?.rating_average ?  
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">Average:{averageRatingOfPhotospot.rating_average }</h1>
         : <h1>no reviews yet</h1> 
    } */}
                                </TabsContent>
                                <TabsContent value="count">
                                    <Form {...getRatingCountForm}>
                                        <form onSubmit={getRatingCountForm.handleSubmit(handlegetRatingCount)} className="space-y-8">
                                            <FormField
                                                control={getRatingCountForm.control}
                                                name="photospot_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ID" {...field} />
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
                                    {/* {
        ratingCountOfPhotospot?.rating_count ?  
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">count:{ratingCountOfPhotospot.rating_count}</h1>
         : <h1>no reviews yet</h1> 
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
                            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Delete your account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {
                                reviews ? reviews.map(review => {
                                    return <div key={review.created_by + ' ' + review.photospot_id} className="flex w-full max-w-sm items-center space-x-2">
                                        <Image key={review.created_by + ' ' + review.photospot_id} width={100} height={100} src={review.photo_paths ? review.photo_paths[0] : ""} alt={review.created_by ? review.created_by + "" : "no pic"} />
                                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={review.created_by + ' ' + review.photospot_id}>created by: {review.created_by}, content: {review.text}</h1>
                                        <Button onClick={() => handleDelete(review.photospot_id)}>Delete</Button>
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


