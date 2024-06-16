"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
const loginSchema = z.object({
    email: z.string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z.string().min(6, {
        message: "password must be at least 6 characters.",
    }),
})
export default function LoginForm() {
    const router = useRouter()
    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onLogin(values: z.infer<typeof loginSchema>) {
        // login(values.email, values.password);
        fetch('/api/auth/login', {
            // fetch('/api/test', {
            method: 'POST',
            body: JSON.stringify(values),
            // method: 'GET',
        })
            .then(() => {
                router.push('/home');
            }).catch((error) => {
                router.push('/error=?' + error.message);
            })
    }

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-8">
                <FormField
                    control={loginForm.control}
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
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>password:</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormDescription>
                                <Link
                                    href="/forgotPassword"
                                    className="underline cursor-pointerunderline text-blue-602 hover:text-blue-800 visited:text-purple-600"
                                >forgot password</Link>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />


                <CardFooter className="flex justify-center">
                    <Button type="submit">Sign In</Button>
                </CardFooter>
            </form>
        </Form>
    )
}