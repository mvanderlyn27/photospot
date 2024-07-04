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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useRouter } from "next/navigation";

export default function DeleteAccountForm({
  profileInfo,
}: {
  profileInfo: any;
}) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate } = useSWRConfig();
  const deleteUserSchema = z.object({
    username: z
      .string()
      .refine(
        (val) => val === profileInfo.username,
        "Username must match your account"
      ),
  });
  const editPasswordForm = useForm<z.infer<typeof deleteUserSchema>>({
    resolver: zodResolver(deleteUserSchema),
    defaultValues: {
      username: "",
    },
  });
  const onDelete = async (data: z.infer<typeof deleteUserSchema>) => {
    fetch("/api/auth/delete", { method: "POST" }).then(async (res) => {
      const result = await res.json();
      if (res.ok) {
        await mutate("/api/profile", null);
        setConfirmDelete(false);
        router.push("/");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: `Error: ${result} , please try again`,
          variant: "destructive",
        });
      }
    });
  };
  const cancelDelete = () => {
    setConfirmDelete(false);
  };
  return (
    <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action is
            permanent.
          </DialogDescription>
        </DialogHeader>
        <Form {...editPasswordForm}>
          <form onSubmit={editPasswordForm.handleSubmit(onDelete)}>
            <div className="grid gap-2 py-4">
              <FormField
                control={editPasswordForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder={`type: ${profileInfo.username}`}
                      {...field}
                    ></Input>
                    <FormDescription>
                      Please enter your username to confirm delete
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant={"destructive"}>
                Confirm Delete
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
