"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "../ui/use-toast";

export const editUsernameSchema = z.object({
    username: z.string().min(3, "Please enter a username at least 3 characters long"),
})
export default function DeleteAccountForm({ profileInfo }: { profileInfo: any }) {
    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig();
    const editUsernameForm = useForm<z.infer<typeof editUsernameSchema>>({
        resolver: zodResolver(editUsernameSchema),
        defaultValues: {
            username: profileInfo.username
        },
    });
    const handleEdit = async (data: z.infer<typeof editUsernameSchema>) => {
        if (data.username) {
            return fetch('/api/profile/edit/username', { body: JSON.stringify({ username: data.username }), method: 'POST' }).then(res => res.json());
        }
    }
    const onEdit = async (data: z.infer<typeof editUsernameSchema>) => {
        setLoading(true);
        const newPath = await mutate('/api/profile/edit/username', handleEdit(data));
        console.log("new path", newPath);
        if (!newPath || newPath?.error) {
            toast({
                title: "Error",
                description: newPath ? newPath.error : "Something went wrong, please try again",
                variant: "destructive",
            })
        }
        else {
            mutate('/api/profile', { ...profileInfo, username: data.username });
        }
        setLoading(false);
    }
    const cancelEdit = () => {
        editUsernameForm.reset();
        setLoading(false);
    };
    return (
        <div className="flex flex-col gap-4 p-4">
            <Form {...editUsernameForm}>
                <form
                    onSubmit={editUsernameForm.handleSubmit(onEdit)}
                >
                    <FormField
                        control={editUsernameForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Update Username:</FormLabel>
                                <div className="flex-row flex gap-4">
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
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