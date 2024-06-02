'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
import OpenWeatherAPI from 'openweather-api-node'
export async function getCurrentWeather(lat: number, lng: number) {
    if (process.env.OPEN_WEATHER_API_KEY) {
        let weather = new OpenWeatherAPI({
            key: process.env.OPEN_WEATHER_API_KEY,
            coordinates: { lat: lat, lon: lng },
            units: "imperial"
        })
        const data = await weather.getCurrent();
        console.log('weather data', data);
        return data;
    }
    return null;
}