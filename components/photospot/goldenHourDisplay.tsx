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
    const [weather, setWeather] = useState<{ conditionId: number, time: Date }[] | undefined>();

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
    const binarySearchWeather = (weather: { conditionId: number, time: Date }[], date: Date) => {
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
    const checkDateInWeatherRange = (weather: { conditionId: number, time: Date }[] | undefined, dateMorning: Date, dateEvening: Date) => {
        let morningWeather = undefined;
        let eveningWeather = undefined;
        if (weather && date) {
            let dateLower = date;
            dateLower.setHours(dateLower.getHours() - 3);
            let dateUpper = date;
            dateUpper.setHours(dateUpper.getHours() + 3);
            console.log('date L', dateLower, 'smallest forecast', weather[0].time, 'date U', dateUpper, 'largest forecast', weather[(weather.length - 1)].time);
            //something going on with check, not properly updating date ranges, needs to get current time and check +- 3 hours to see if we're in the range
            if (weather[0].time <= dateLower && weather[(weather.length - 1)].time >= dateUpper) {
                //date in range for forecast
                //find closest date
                morningWeather = binarySearchWeather(weather, dateMorning).conditionId;
                eveningWeather = binarySearchWeather(weather, dateEvening).conditionId;
                console.log('closest weather', morningWeather, eveningWeather);
            }
        }
        return { morningWeather, eveningWeather };
    }
    useEffect(() => {
        //update photoTimeWidgetInfos here based on which types of photos
        if (date && lat && lng) {
            let times = SunCalc.getSunTimes(date, lat, lng);
            const { morningWeather, eveningWeather } = checkDateInWeatherRange(weather, times.goldenHourDawnStart.value, times.goldenHourDuskStart.value);

            console.log('weather', weather, morningWeather, eveningWeather);
            setPhotoTimeWidgetInfos([
                {
                    time: times.goldenHourDawnStart.value,
                    time_label: PhotoTime.golden_hour_morning,
                    weather: morningWeather ? convertWeather(morningWeather) : undefined,
                },
                {
                    time: times.goldenHourDuskStart.value,
                    time_label: PhotoTime.golden_hour_evening,
                    weather: eveningWeather ? convertWeather(eveningWeather) : undefined,
                },
            ]);
        }
    }, [weather, date, lat, lng]);
    useEffect(() => {
        setDate(new Date());
        if (lat && lng) {

            getForecast(lat, lng).then(weatherArray => {
                if (weatherArray) {
                    setWeather(weatherArray.map(w => ({ conditionId: w.weather.conditionId, time: w.dt })));
                }
            })
        }
    }, [lat, lng]);
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
