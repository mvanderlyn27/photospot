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

export const editEmailSchema = z.object({
  email: z
    .string()
    .min(1, "need to enter an email to update")
    .email("Need to enter a valid email"),
});
export default function EditEmailForm({ profileInfo }: { profileInfo: any }) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const editEmailForm = useForm<z.infer<typeof editEmailSchema>>({
    resolver: zodResolver(editEmailSchema),
    defaultValues: {
      email: profileInfo.email,
    },
  });
  const handleEdit = async (data: z.infer<typeof editEmailSchema>) => {
    if (data.email) {
      return fetch("/api/profile/edit/email", {
        body: JSON.stringify({ email: data.email }),
        method: "POST",
      }).then((res) => res.json());
    }
  };
  const onEdit = async (data: z.infer<typeof editEmailSchema>) => {
    setLoading(true);
    const newPath = await mutate("/api/profile/edit/email", handleEdit(data));
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
      mutate("/api/profile", { ...profileInfo, email: data.email });
      toast({
        title: "Email sent",
        description: "Check email to confirm update",
      });
    }
    setLoading(false);
  };
  const cancelEdit = () => {
    editEmailForm.reset();
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      <Form {...editEmailForm}>
        <form onSubmit={editEmailForm.handleSubmit(onEdit)}>
          <FormField
            control={editEmailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Update Email:</FormLabel>
                <div className="flex-row flex gap-4">
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
  );
}
