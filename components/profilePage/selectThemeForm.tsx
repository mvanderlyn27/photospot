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
import { Themes } from "@/types/photospotTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTheme } from "next-themes";

export const editThemeSchema = z.object({
    theme: z.nativeEnum(Themes),
})
export default function SelectThemeForm({ profileInfo }: { profileInfo: any }) {
    const { setTheme } = useTheme()
    const { mutate } = useSWRConfig();
    const [loading, setLoading] = useState(false);
    const editThemeForm = useForm<z.infer<typeof editThemeSchema>>({
        resolver: zodResolver(editThemeSchema),
        defaultValues: {
            theme: profileInfo.theme
        },
    });
    const handleEdit = async (data: z.infer<typeof editThemeSchema>) => {
        if (data.theme) {
            return fetch('/api/profile/edit/theme', { body: JSON.stringify({ theme: data.theme }), method: 'POST' }).then(res => res.json());
        }
    }
    const onEdit = async (data: z.infer<typeof editThemeSchema>) => {
        setLoading(true);
        const updateInfo = await mutate('/api/profile/edit/theme', handleEdit(data));
        if (!updateInfo || updateInfo?.error) {
            toast({
                title: "Error",
                description: updateInfo ? updateInfo.error : "Something went wrong, please try again",
                variant: "destructive",
            })
        }
        else {
            mutate('/api/profile', { ...profileInfo, theme: data.theme });
            // setTheme(data.theme);
            toast({
                title: "Success",
                description: "Theme updated successfully",
            })
        }
        setLoading(false);
    }
    const cancelEdit = () => {
        editThemeForm.reset();
        setLoading(false);
    };
    return (
        <div className="flex flex-col gap-4 p-4">
            <Form {...editThemeForm}>
                <form
                    onSubmit={editThemeForm.handleSubmit(onEdit)}
                >
                    <FormField
                        control={editThemeForm.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Update Theme</FormLabel>
                                <div className="flex-row flex gap-4">
                                    <Select onValueChange={(value) => {
                                        setTheme(value);
                                        field.onChange(value)
                                    }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a theme" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.keys(Themes).map(theme => <SelectItem key={theme} value={theme}>{theme}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
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