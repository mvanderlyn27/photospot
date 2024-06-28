"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";

export const editBioSchema = z.object({
    bio: z.string().min(3, "Please enter a bio at least 3 characters long"),
})
export default function EditBioForm({ profileInfo }: { profileInfo: any }) {
    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig();
    const editBioForm = useForm<z.infer<typeof editBioSchema>>({
        resolver: zodResolver(editBioSchema),
        defaultValues: {
            bio: profileInfo.bio
        },
    });
    const handleEdit = async (data: z.infer<typeof editBioSchema>) => {
        if (data.bio) {
            return fetch('/api/profile/edit/bio', { body: JSON.stringify({ bio: data.bio }), method: 'POST' }).then(res => res.json());
        }
    }
    const onEdit = async (data: z.infer<typeof editBioSchema>) => {
        setLoading(true);
        const newPath = await mutate('/api/profile/edit/bio', handleEdit(data));
        console.log("new path", newPath);
        if (!newPath || newPath?.error) {
            toast({
                title: "Error",
                description: newPath ? newPath.error : "Something went wrong, please try again",
                variant: "destructive",
            })
        }
        else {
            mutate('/api/profile', { ...profileInfo, bio: data.bio });
        }
        setLoading(false);
    }
    const cancelEdit = () => {
        editBioForm.reset();
        setLoading(false);
    };
    return (
        <div className="flex flex-col gap-4 p-4">
            <Form {...editBioForm}>
                <form
                    onSubmit={editBioForm.handleSubmit(onEdit)}
                >
                    <FormField
                        control={editBioForm.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Update Bio:</FormLabel>
                                <div className="flex-row flex gap-4">
                                    <FormControl>
                                        <Textarea placeholder="about me.."  {...field} />
                                    </FormControl>
                                    <Button type="submit" disabled={loading}>
                                        Save
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

        </div>
    )
}