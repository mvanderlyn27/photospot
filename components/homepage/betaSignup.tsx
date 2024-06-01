"use client"
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { betaSignup } from "@/app/serverActions/homepage/betaSignup";
import { toast } from "../ui/use-toast";
export const betaSignupSchema = z.object({
    //should add some better requirements for the location
    email: z.string().email(),
});

export default function BetaSignup() {
    const betaSignupForm = useForm<z.infer<typeof betaSignupSchema>>({
        resolver: zodResolver(betaSignupSchema),
        defaultValues: {
            email: "",
        }
    });

    const handleBetaSignup = (data: z.infer<typeof betaSignupSchema>) => {
        console.log(data)
        if (data.email) {
            betaSignup(data.email).then(() => {
                console.log("success")
                toast({
                    title: "Success!",
                    description: "You have been added to the beta list!",
                })
                betaSignupForm.reset()
            })
        }
    }
    return (
        <Form {...betaSignupForm}>
            <form onSubmit={betaSignupForm.handleSubmit(handleBetaSignup)} className=" w-full flex flex-col">
                <div className="flex flex-row items-center p-4 gap-2 ">
                    <h1 className=" text-background text-2xl font-bold">Email: </h1>
                    <div className="flex-1">
                        <FormField

                            control={betaSignupForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <Input className="border-solid border-2 w-full text-background text-lg" type="email" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <Button type="submit">Submit</Button>

                </div>
            </form>
        </Form>
    )
}