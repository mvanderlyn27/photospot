"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NSFWTextMatcher } from "@/utils/common/obscenity";
import Link from "next/link";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
});
export default function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    fetch("/api/auth/resetPasswordEmail", {
      method: "POST",
      body: JSON.stringify({
        email: values.email,
      }),
    })
      .then(() => {
        console.log("email sent");
        toast({
          title: "Email sent",
        });
        forgotPasswordForm.reset();
      })
      .catch((error) => {
        toast({
          title: "Error, try again" + error.message,
        });
      });
  };
  const handleCancel = () => {
    forgotPasswordForm.reset();
    router.push("/login");
  };
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/login"
        className="absolute left-8 top-16 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Enter email to reset password</CardTitle>
        </CardHeader>

        <form
          onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <CardContent>
            <Form {...forgotPasswordForm}>
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="email@email.com" {...field} />
                    </FormControl>
                    <FormDescription>Email for your account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
            >
              Cancel
            </Button>

            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
