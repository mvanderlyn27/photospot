import { Popover } from "@radix-ui/react-popover";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import PhotoTimeWidget from "./photoTimeWidget";
import {
    PhotoTime,
    PhotoTimeWidgetInfo,
    Weather,
} from "@/types/photospotTypes";
import { CurrentConditions, CurrentWeather } from "openweather-api-node";
import { getCurrentWeather } from "@/app/serverActions/weather/getCurrentWeather";
import { getForecast } from "@/app/serverActions/weather/getForecast";
import { Skeleton } from "../ui/skeleton";
let SunCalc = require('suncalc3');

export default function PhotoTimes({
    lat,
    lng,
}: {
    lat: number | undefined;
    lng: number | undefined;
}) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [loadingPhotoTime, setLoadingPhotoTime] = useState<boolean>(true);
    const [photoTimeWidgetInfos, setPhotoTimeWidgetInfos] = useState<PhotoTimeWidgetInfo[] | undefined>([]);
    const [weather, setWeather] = useState<{ conditionId: number, time: Date, temp: number }[] | undefined>();

    const convertWeather = (curWeather: number): Weather | undefined => {
        if (String(curWeather).startsWith("8")) {
            if (curWeather === 800) {
                return Weather.sun;
            }
            return Weather.clouds;
        }
        if (String(curWeather).startsWith("2")) {
            return Weather.storm
        }
        if (String(curWeather).startsWith("3")) {
            return Weather.drizzle
        }
        if (String(curWeather).startsWith("5")) {
            return Weather.rain
        }
        if (String(curWeather).startsWith("6")) {
            return Weather.snow
        }
    }
    const binarySearchWeather = (weather: { conditionId: number, time: Date, temp: number }[], date: Date) => {
        let start = 0
        let end = weather.length - 1;
        while (start < end) {
            let mid = Math.round((start + end) / 2);
            if (weather[mid].time < date) {
                start = mid + 1
            } else if (weather[mid].time > date) {
                end = mid - 1
            }
            else {
                return weather[mid]
            }
        }
        return weather[start];
    }
    const checkDateInWeatherRange = (weather: { conditionId: number, time: Date, temp: number }[] | undefined, dateMorning: Date, dateEvening: Date) => {
        let morningWeather = undefined;
        let eveningWeather = undefined;
        if (weather && date) {
            let dateLower = new Date(date);
            dateLower.setHours(dateLower.getHours() + 3);
            let dateUpper = new Date(date);
            dateUpper.setHours(dateUpper.getHours() - 3);
            if (weather[0].time <= dateLower && weather[(weather.length - 1)].time >= dateUpper) {
                //date in range for forecast
                //find closest dates
                morningWeather = binarySearchWeather(weather, dateMorning);
                eveningWeather = binarySearchWeather(weather, dateEvening);
            }
        }
        return { morningWeather, eveningWeather };
    }
    const updatePhotoTimeWidgetInfos = (weather: { conditionId: number, time: Date, temp: number }[], date: Date, lat: number, lng: number) => {
        if (weather && date && lat && lng) {
            let times = SunCalc.getSunTimes(date, lat, lng);
            const { morningWeather, eveningWeather } = checkDateInWeatherRange(weather, times.goldenHourDawnStart.value, times.goldenHourDuskEnd.value);
            setPhotoTimeWidgetInfos([
                {
                    start: times.goldenHourDawnStart.value,
                    end: times.goldenHourDawnEnd.value,
                    time_label: PhotoTime.golden_hour_morning,
                    weather: morningWeather ? convertWeather(morningWeather.conditionId) : undefined,
                    temp: morningWeather ? morningWeather.temp : undefined,
                },
                {
                    start: times.goldenHourDuskStart.value,
                    end: times.goldenHourDuskEnd.value,
                    time_label: PhotoTime.golden_hour_evening,
                    weather: eveningWeather ? convertWeather(eveningWeather.conditionId) : undefined,
                    temp: eveningWeather ? eveningWeather.temp : undefined,
                },
            ]);
        }
    }
    useEffect(() => {
        const date = new Date();
        setDate(date);
        if (lat && lng) {

            getForecast(lat, lng).then(weatherArray => {
                if (weatherArray) {
                    const weather = weatherArray.map(w => ({ conditionId: w.weather.conditionId, time: w.dt, temp: w.weather.temp.cur }));
                    setWeather(weather);
                    updatePhotoTimeWidgetInfos(weather, date, lat, lng);

                    setLoadingPhotoTime(false);
                }
            });
        }
    }, [lat, lng])
    //take in lat/lng have option to chose date, default to today, lookup golden hour times using an npm package
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-none flex-row items-center gap-2 justify-left">
                <h1 className="text-2xl font-semibold">When are you going?</h1>
                <DatePicker date={date} setDate={setDate} />
            </div>
            {loadingPhotoTime ? <Skeleton className="w-full h-[300px]  bg-slate-800/10 " /> :
                <div className="flex flex-col justify-left gap-8">
                    {photoTimeWidgetInfos?.map((photoTimeWidgetInfo) => (
                        <PhotoTimeWidget info={photoTimeWidgetInfo} />
                    ))}
                </div>
            }
        </div>
    );
}

function DatePicker({
    date,
    setDate,
}: {
    date: Date | undefined;
    setDate: any;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <div className="rounded-md border">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>
            </PopoverContent>
        </Popover>
    );
}
