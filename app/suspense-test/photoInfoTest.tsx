"use client"
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";


export default function PhotoInfoTest() {
    // const weather = await fetch(`https://api.weather.gov/points/${lat}/${lng}`).then(async (res) => res);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const supabase = createClient();
    const { data, isLoading, error } = useQuery(
        supabase.from("photospots").select("*"),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );
    // await delay(1000);
    console.log('data', data);
    return (
        <div>
            <h1>Test Suspense</h1>
            {isLoading && <h1>Loading...</h1>}
            {data && data.map((photospot) =>
                <h1>{photospot.location_name}</h1>
            )
            }
        </div>
    )
}