'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
import OpenWeatherAPI from 'openweather-api-node'
export async function getForecast(lat: number, lng: number) {
    //3 hourly next 5 days
    if (process.env.OPEN_WEATHER_API_KEY) {
        let weather = new OpenWeatherAPI({
            key: process.env.OPEN_WEATHER_API_KEY,
            coordinates: { lat: lat, lon: lng },
            units: "imperial"
        })
        // const data = await weather.getHourlyForecast();
        const data = await weather.getForecast();
        return data;
    }
    return null;
}