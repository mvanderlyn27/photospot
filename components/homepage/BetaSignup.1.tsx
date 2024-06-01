import { z } from "zod";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { betaSignupSchema } from "./betaSignup";


export default function BetaSignup() {
    const betaSignupForm = useForm<z.infer<typeof betaSignupSchema>>({
        resolver: zodResolver(betaSignupSchema),
        defaultValues: {
            email: "",
        }
    });

    const betaSignup = (data: z.infer<typeof betaSignupSchema>) => {
        console.log(data);
    };
    return (
        <Form {...betaSignupForm}>
            <form onSubmit={betaSignupForm.handleSubmit(betaSignup)} className=" w-full flex flex-col">

                <CardContent className={`flex-1 overflow-auto mb-4 }`}>
                    <FormField
                        control={betaSignupForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" {...field} />
                                <FormDescription>
                                    Enter email to get beta access
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                </CardContent>
                <CardFooter className="flex-none flex-col gap-4">
                    <div className="w-full flex flex-row gap-8 justify-center">
                        <Button variant="outline" onClick={(e) => { e.preventDefault(); resetForm(); }}>Reset</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                    <div className="w-full flex flex-row gap-8 justify-center">
                        {!confirmDelete && <Button variant="destructive" onClick={(e) => { e.preventDefault(); promptDelete(true); }}>Delete</Button>}
                        {confirmDelete && <Button variant="outline" onClick={(e) => { e.preventDefault(); promptDelete(false); }}>Cancel Delete</Button>}
                        {confirmDelete && <Button variant="destructive" onClick={(e) => { e.preventDefault(); handleDelete(); }}>Confirm Delete</Button>}
                    </div>
                </CardFooter>
            </form>
        </Form>

    );
}
