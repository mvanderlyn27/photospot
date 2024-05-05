"use client"
import { useEffect } from "react"

export default function PhotospotPage({ params }: { params: { id: string } }) {
    useEffect(() => {
        //pull info from photospot based on id 
    }, [])
    return (
        <div>
            <h1>Photospot {params.id}</h1>
        </div>
    )
}
