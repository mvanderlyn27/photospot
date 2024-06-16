"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { NSFWTextMatcher } from '@/utils/common/obscenity'
const signupSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).refine((val) => !NSFWTextMatcher.hasMatch(val), "No Profanity allowed ;)"),
    email: z.string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    //future check if email is used
    // .refine(async (e) => {
    //   // Where checkIfEmailIsValid makes a request to the backend
    //   // to see if the email is valid.
    //   return await checkIfEmailIsValid(e);
    // }, "This email is not in our database"),
    password: z.string().min(6, {
        message: "password must be at least 6 characters.",
    }),
    confirmPassword: z.string()
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            path: ["confirmPassword"],
            code: "custom",
            message: "The passwords did not match"
        });
    }
});

export default function SignUpForm() {
    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })
    function onSignup(values: z.infer<typeof signupSchema>) {
        // signup(values.username, values.email, values.password);
        fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(values),
        });
    }
    return (
        <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-8">
                <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username:</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email:</FormLabel>
                            <FormControl>
                                <Input placeholder="email@email.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Email for your account
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password:</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password:</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                <CardFooter className="flex justify-center">
                    <Button type="submit">Sign up</Button>
                </CardFooter>
            </form>
        </Form>
    )
}