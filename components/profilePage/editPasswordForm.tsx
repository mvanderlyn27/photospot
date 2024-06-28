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

export const editPasswordSchema = z.object({
    password: z.string().min(3, "Please enter a password at least 3 characters long"),
})
export default function EditPasswordForm({ profileInfo }: { profileInfo: any }) {
    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig();
    const editPasswordForm = useForm<z.infer<typeof editPasswordSchema>>({
        resolver: zodResolver(editPasswordSchema),
        defaultValues: {
            password: ''
        },
    });
    const handleEdit = async (data: z.infer<typeof editPasswordSchema>) => {
        if (data.password) {
            return fetch('/api/profile/edit/password', { body: JSON.stringify({ password: data.password }), method: 'POST' }).then(res => res.json());
        }
    }
    const onEdit = async (data: z.infer<typeof editPasswordSchema>) => {
        setLoading(true);
        const newPath = await mutate('/api/profile/edit/password', handleEdit(data));
        console.log("new path", newPath);
        if (!newPath || newPath?.error) {
            toast({
                title: "Error",
                description: newPath ? newPath.error : "Something went wrong, please try again",
                variant: "destructive",
            })
        }
        else {
            mutate('/api/profile');
            toast({
                title: "Success",
                description: "Password updated successfully",
            })
        }
        cancelEdit();
    }
    const cancelEdit = () => {
        editPasswordForm.reset();
        setLoading(false);
    };
    return (
        <div className="flex flex-col gap-4 p-4">
            <Form {...editPasswordForm}>
                <form
                    onSubmit={editPasswordForm.handleSubmit(onEdit)}
                >
                    <FormField
                        control={editPasswordForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Update Password:</FormLabel>
                                <div className="flex-row flex gap-4">
                                    <FormControl>
                                        <Input type="password" placeholder="" {...field} />
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