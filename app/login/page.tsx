import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/loginForm";
import SignUpForm from "@/components/auth/signUpForm";

export default function Login() {
  return (
    <div className="absolute inset-0 flex items-center justify-center h-full">
      <Link
        href="/"
        className="absolute left-2 md:left-8 top-16 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
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
      <Tabs
        defaultValue="signin"
        className=" w-full p-4 pt-20 md:p-4 md:w-[400px] "
      >
        <TabsList className="grid w-full grid-cols-2 text-foreground background">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card className="w-full md:w-[400px]">
            <CardHeader>
              <CardTitle>Sign in to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="w-full md:w-[400px]">
            <CardHeader>
              <CardTitle>Sign up for an account</CardTitle>
            </CardHeader>
            <CardContent>
              <SignUpForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
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
