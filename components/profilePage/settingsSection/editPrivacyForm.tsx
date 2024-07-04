"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";
import { toast } from "../../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export const editPrivateProfileSchema = z.object({
  private_profile: z.boolean(),
});
export default function EditPrivacyForm({ profileInfo }: { profileInfo: any }) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const editPrivateProfileForm = useForm<
    z.infer<typeof editPrivateProfileSchema>
  >({
    resolver: zodResolver(editPrivateProfileSchema),
    defaultValues: {
      private_profile: profileInfo.private_profile,
    },
  });
  const handleEdit = async (data: z.infer<typeof editPrivateProfileSchema>) => {
    if (data.private_profile !== undefined) {
      return fetch("/api/profile/edit/privateProfile", {
        body: JSON.stringify({ private_profile: data.private_profile }),
        method: "POST",
      }).then((res) => res.json());
    }
  };
  const onEdit = async (data: z.infer<typeof editPrivateProfileSchema>) => {
    setLoading(true);
    const newPath = await mutate(
      "/api/profile/edit/privateProfile",
      handleEdit(data)
    );
    console.log("new path", newPath);
    if (!newPath || newPath?.error) {
      toast({
        title: "Error",
        description: newPath
          ? newPath.error
          : "Something went wrong, please try again",
        variant: "destructive",
      });
    } else {
      mutate("/api/profile", {
        ...profileInfo,
        private_profile: data.private_profile,
      });
    }
    setLoading(false);
  };
  const cancelEdit = () => {
    editPrivateProfileForm.reset();
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      <Form {...editPrivateProfileForm}>
        <form onSubmit={editPrivateProfileForm.handleSubmit(onEdit)}>
          <FormField
            control={editPrivateProfileForm.control}
            name="private_profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Privacy</FormLabel>
                <div className="flex-row flex gap-4">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "true");
                    }}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="public" value={"false"}>
                        Public
                      </SelectItem>
                      <SelectItem key="private" value={"true"}>
                        Private
                      </SelectItem>
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
  );
}
