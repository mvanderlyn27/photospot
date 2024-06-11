"use server"
import { NextRequest, NextResponse } from "next/server";
import OpenWeatherAPI from "openweather-api-node";

export async function GET(request: NextRequest) {
    // 3 hourly next 5 days
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    if (!process.env.OPEN_WEATHER_API_KEY || !lat || !lng) {
        return new NextResponse("error: missing weather arguments", { status: 400 });
    }
    let weather = new OpenWeatherAPI({
        key: process.env.OPEN_WEATHER_API_KEY,
        coordinates: { lat: parseInt(lat), lon: parseInt(lng) },
        units: "imperial"
    })
    // const data = await weather.getHourlyForecast();
    const data = await weather.getForecast();
    return NextResponse.json(data);
};