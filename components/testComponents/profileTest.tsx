"use client"
import useSWR from "swr";
import { Photolist, PhotolistInput, Photospot, PublicProfile } from "../../types/photospotTypes"
import Loading from "../common/Loading";
import { MouseEvent, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
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

export default function ProfileTests() {
    //STATE COMPONENT STATE
    const { data: profiles, error, isLoading, mutate: refreshPublicProfile } = useSWR<PublicProfile[], { error: PostgrestError, message: number }, any>("/api/profiles/", fetcher);
    const { data: privateProfile, error: privateError, isLoading: privateIsLoading, mutate: refreshPrivateProfile } = useSWR<PublicProfile, { error: PostgrestError, message: number }, any>("/api/profiles/myProfile/", fetcher);
    //   const { data: profileByUsername, trigger: searchProfileByUsername}: {data: PublicProfile[], trigger: any} = useSWRMutation('/api/profiles/search/byUsername', searchByUsername);
    //   const { data: profileById, trigger: searchProfileById}: {data: PublicProfile[], trigger: any} = useSWRMutation('/api/profiles/search/byId', searchById);

    //FORM VALIDATION SECTION
    const MAX_FILE_SIZE = 5242880; //5MB
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const createFormSchema = z.object({
        email: z.string(),
        password: z.string(),
        username: z.string()
    })
    const createForm = useForm<z.infer<typeof createFormSchema>>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            email: "",
            password: "",
            username: undefined,
        },
        mode: 'onChange',
    });
    const handleCreate = async (values: z.infer<typeof createFormSchema>) => {
        const resp = await fetch('/api/profiles/createTestAccount', { method: 'POST', body: JSON.stringify(values) });
        await refreshPublicProfile();
        await refreshPrivateProfile();
    }
    const handleCreateRandomUser = async () => {
        const resp = await fetch('/api/profiles/createTestAccountRandom', { method: 'POST' });
        await refreshPublicProfile();
    }

    const updateFormSchema = z.object({
        updateUsername: z.string().optional(),
        updateProfilePicture: z
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
        updatePrivate: z.boolean().default(false).optional(),
        updateTheme: z.string().optional(),
        updateEmail: z.string().optional(),
        updatePassword: z.string().optional(),
    });
    const updateForm = useForm<z.infer<typeof updateFormSchema>>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            updateUsername: privateProfile?.username,
            updateEmail: privateProfile?.email,
            updatePassword: undefined,
            updateProfilePicture: undefined,
            updatePrivate: privateProfile?.private,
            updateTheme: privateProfile?.theme,
        },
        mode: 'onChange',
    });
    const getProfileUpdateInfo = (values: z.infer<typeof updateFormSchema>) => {
        let out: any = {};
        if (values.updateUsername !== undefined) {
            out.username = values.updateUsername
        }
        if (values.updatePrivate !== undefined) {
            out.private = values.updatePrivate
        }
        if (values.updateTheme !== undefined) {
            out.theme = values.updateTheme;
        }
        return out;
    }
    const getAuthUpdateInfo = (values: z.infer<typeof updateFormSchema>) => {
        let out: any = {}
        if (values.updateEmail !== undefined) {
            out.email = values.updateEmail
        }
        if (values.updatePassword !== undefined) {
            out.password = values.updatePassword
        }
        return out;
    }
    const handleUpdate = async (values: z.infer<typeof updateFormSchema>) => {
        console.log('update photospot', JSON.stringify(values));
        let formData = new FormData();
        //create object with entries for update
        let profileInfo: any = getProfileUpdateInfo(values);
        let authInfo: any = getAuthUpdateInfo(values);
        if (Object.entries(profileInfo).length > 0) {
            formData.append("profile_info", JSON.stringify(profileInfo));
        }
        if (Object.entries(authInfo).length > 0) {
            const authResponse = await fetch('/auth/update', { method: 'POST', body: JSON.stringify(authInfo) })
            if (!authResponse.ok) {
                console.log('error updating profile', authResponse);
            }
            console.log('updated auth');
        }
        if (values.updateProfilePicture) {
            formData.append("profile_picture", values.updateProfilePicture[0]);
        }
        const updateResponse = await fetch('/api/profiles/update', { method: 'POST', body: formData });

        if (!updateResponse.ok) {
            console.log('error updating profile', updateResponse);
        }
        console.log('successful update');
        await refreshPublicProfile();
        await refreshPrivateProfile();
    }
    const handleDelete = async () => {
        // await refreshPhotospots(deletePhotospottMutation(id, profiles), deletePhotospotOptions(id, profiles));
        const resp = await fetch('/api/profiles/delete', { method: 'POST' });
        console.log('delete', resp);
        //need a better way to do htis
        location.reload();
    }
    const searchByIdFormSchema = z.object({
        searchId: z.coerce.number({ required_error: "Please select a photospot to update via id" }),
    });
    const searchByIdForm = useForm<z.infer<typeof searchByIdFormSchema>>({
        resolver: zodResolver(searchByIdFormSchema),
        defaultValues: {
            searchId: undefined,
        },
        mode: 'onChange',
    });
    const handleSearchById = async (values: z.infer<typeof searchByIdFormSchema>) => {
        // await searchProfileById({id: values.searchId});
    }

    const searchByUsernameFormSchema = z.object({
        searchUsername: z.string(),
    });
    const searchByUsernameForm = useForm<z.infer<typeof searchByUsernameFormSchema>>({
        resolver: zodResolver(searchByUsernameFormSchema),
        defaultValues: {
            searchUsername: undefined,
        },
        mode: 'onChange',
    });
    const handleSearchByUsername = async (values: z.infer<typeof searchByUsernameFormSchema>) => {
        console.log('searching by name', values.searchUsername);
        // await searchProfileByUsername({username: values.searchUsername });
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
                                profiles ? profiles.map(profile => {
                                    return <div key={profile.id} className="flex w-full max-w-sm items-center space-x-2">
                                        <Image key={profile.id} width={100} height={100} src={profile.profile_pic_url ? profile.profile_pic_url : ""} alt={profile.id ? profile.id + "" : "no pic"} />
                                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={profile.id}>ID: {profile.id}, Name: {profile.username}</h1>
                                    </div>
                                }) : <h1>no data yet</h1>
                            }
                        </CardContent>
                        <CardFooter>
                            <Button disabled onClick={() => handleCreateRandomUser()}>Create Random User (need to fix) </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="privateProfile">
                    <Card>
                        <CardHeader>
                            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">My Porfile Info!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {
                                privateProfile ? <div key={privateProfile.id} className="flex w-full max-w-sm items-center space-x-2">
                                    <Image key={privateProfile.id} width={100} height={100} className="" src={privateProfile.profile_pic_url ? privateProfile.profile_pic_url : ""} alt={privateProfile.id ? privateProfile.id + "" : "no pic"} />
                                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={privateProfile.id}>ID: {privateProfile.id}, Name: {privateProfile.username}</h1>
                                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={privateProfile.id + "2"}>{JSON.stringify(privateProfile)}</h1>
                                </div> : <h1>no data yet</h1>
                            }
                        </CardContent>
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
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email" {...field} />
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
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="password" type="password" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Test user's password
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="username" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter username
                                                </FormDescription>
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
                                        name="updateUsername"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username:</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={privateProfile?.username}{...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    change username:
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateForm.control}
                                        name="updateEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={privateProfile?.email} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    change email
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateForm.control}
                                        name="updatePassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="*******" type="password" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    password
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateForm.control}
                                        name="updateProfilePicture"
                                        render={({ field: { onChange }, ...field }) => (
                                            <FormItem>
                                                <FormLabel>Profile Picture</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="file" onChange={(e) => { console.log('updated file', e.target.files); onChange(e.target.files) }} />
                                                </FormControl>
                                                <FormDescription>
                                                    Upload pictures for your profile
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={updateForm.control}
                                        name="updateTheme"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Theme</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={privateProfile?.theme} />
                                                </FormControl>
                                                <FormDescription>
                                                    Select what theme to use (Options: light, dark, device)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={updateForm.control}
                                        name="updatePrivate"
                                        render={({ field }) => {
                                            console.log('check field', field); return (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormLabel htmlFor="private" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Private:
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Checkbox id="private" checked={field.value !== undefined ? field.value : privateProfile?.private} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
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
                            <Tabs defaultValue="username" className="w-[600px]">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="username">Username</TabsTrigger>
                                    <TabsTrigger value="id">By ID</TabsTrigger>
                                </TabsList>
                                <TabsContent value="username">
                                    <Form {...searchByUsernameForm}>
                                        <form onSubmit={searchByUsernameForm.handleSubmit(handleSearchByUsername)} className="space-y-8">
                                            <FormField
                                                control={searchByUsernameForm.control}
                                                name="searchUsername"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Username</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="username" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Username for photospot
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit">Search</Button>
                                        </form>
                                    </Form>
                                    {/* {
        profileByUsername ? profileByUsername.map(profiles=> {
        return <div key={profiles.id} className="flex w-full max-w-sm items-center space-x-2">
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={profiles.id}>ID: {profiles.id}, Name: {profiles.username}</h1>
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
        profileById ? profileById.map(profiles=> {
        return <div key={profiles.id} className="flex w-full max-w-sm items-center space-x-2">
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight" key={profiles.id}>ID: {profiles.id}, Name: {profiles.username}</h1>
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
                            <CardTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Delete your account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button onClick={() => handleDelete()}>Delete</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}


