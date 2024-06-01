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
import { getWeather } from "@/app/serverActions/weather/getWeather";
import { CurrentConditions, CurrentWeather } from "openweather-api-node";
let SunCalc = require('suncalc3');

export default function GoldenHourDisplay({
    lat,
    lng,
}: {
    lat: number | undefined;
    lng: number | undefined;
}) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [photoTimeWidgetInfos, setPhotoTimeWidgetInfos] = useState<PhotoTimeWidgetInfo[] | undefined>([]);
    const [weather, setWeather] = useState<CurrentConditions | undefined>();

    const convertWeather = (curWeather: CurrentConditions): Weather | undefined => {
        curWeather.conditionId = 801;
        if (String(curWeather.conditionId).startsWith("8")) {
            if (curWeather.conditionId === 800) {
                return Weather.sun;
            }
            return Weather.clouds;
        }
        if (String(curWeather.conditionId).startsWith("2")) {
            return Weather.storm
        }
        if (String(curWeather.conditionId).startsWith("3")) {
            return Weather.drizzle
        }
        if (String(curWeather.conditionId).startsWith("5")) {
            return Weather.rain
        }
        if (String(curWeather.conditionId).startsWith("6")) {
            return Weather.snow
        }
    }


    useEffect(() => {
        //update photoTimeWidgetInfos here based on which types of photos
        if (date && lat && lng) {
            let times = SunCalc.getSunTimes(date, lat, lng);
            console.log('times for golden hour', times);
            setPhotoTimeWidgetInfos([
                {
                    time: times.goldenHourDawnStart.value,
                    time_label: PhotoTime.golden_hour_morning,
                    weather: weather ? convertWeather(weather) : undefined,
                },
                {
                    time: times.goldenHourDuskStart.value,
                    time_label: PhotoTime.golden_hour_evening,
                    weather: weather ? convertWeather(weather) : undefined,
                },
            ]);
        }
    }, [date, lat, lng]);
    useEffect(() => {
        setDate(new Date());
        getWeather().then(weather => {
            console.log('weather', weather);
            setWeather(weather?.weather);
        })
    }, []);
    //take in lat/lng have option to chose date, default to today, lookup golden hour times using an npm package
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2 justify-center ">
                <h1 className="text-xl font-semibold">Best Photo Times for: </h1>
                <DatePicker date={date} setDate={setDate} />
            </div>
            <div className="flex flex-row justify-center gap-8">
                {photoTimeWidgetInfos?.map((photoTimeWidgetInfo) => (
                    <PhotoTimeWidget info={photoTimeWidgetInfo} />
                ))}
            </div>
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
