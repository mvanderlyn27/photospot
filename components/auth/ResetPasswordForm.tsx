"use client"
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
import Link from "next/link"



const resetPasswordSchema = z.object({
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

export default function ResetPasswordForm() {
    const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })
    const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
        fetch(
            '/api/auth/resetPasswordEmail',
            {
                method: 'POST',
                body: JSON.stringify({
                    password: values.password,
                }),
            }
        )
    }
    /*    
    should add in validation, and make prettier 
    */
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">

            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Sign in to your account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...resetPasswordForm}>
                        <form onSubmit={resetPasswordForm.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={resetPasswordForm.control}
                                name="password"
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
                                control={resetPasswordForm.control}
                                name="confirmPassword"
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
                            <CardFooter className="flex justify-center">
                                <Button type="submit">Sign In</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
    )
}