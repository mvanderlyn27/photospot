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
import { signin, signup } from '../serverActions/auth/login'
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
  }).refine((val) => NSFWTextMatcher.hasMatch(val), "No Profanity allowed ;)"),
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
const signinSchema = z.object({
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
})


export default function Login() {


  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })
  const signinForm = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  function onSignup(values: z.infer<typeof signupSchema>) {
    signup(values.username, values.email, values.password);
  }
  function onSignin(values: z.infer<typeof signinSchema>) {
    signin(values.email, values.password);
  }
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
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
        </svg>{' '}
        Back
      </Link>
      <Tabs defaultValue="signin" className="w-[400px] ">
        <TabsList className="grid w-full grid-cols-2 text-foreground background">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Sign in to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...signinForm}>
                <form onSubmit={signinForm.handleSubmit(onSignin)} className="space-y-8">
                  <FormField
                    control={signinForm.control}
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
                    control={signinForm.control}
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Sign up for an account</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  )
}

/*
 <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
<Link
          href="/forgotPassword"
          className="underline cursor-pointerunderline text-blue-601 hover:text-blue-800 visited:text-purple-600"
        > forgot password</Link>

        <button className="bg-zinc-950 rounded px-4 py-2 text-white mb-2">
          Sign In
        </button>
*/