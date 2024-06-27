"use client"
import { Card, CardContent, CardTitle } from "../ui/card";
import Image from 'next/image';

export default function MyAccount({ user }: { user: any }) {
    /*
    //change password/email
    //delete account
    */
    return (
        <>
            {user &&
                <Card>
                    <CardTitle>My Account</CardTitle>
                    <CardContent>
                        <div className="flex flex-col">
                            <h1> {user.username}</h1>
                        </div>
                    </CardContent>
                </Card>
            }
        </>
    )
}