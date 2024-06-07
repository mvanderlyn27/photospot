import { PhotoTime, PhotoTimeDisplayInfo, Weather } from "@/types/photospotTypes";
import {
  TiWeatherDownpour,
  TiWeatherCloudy,
  TiWeatherSunny,
} from "react-icons/ti";
import { Skeleton } from "../ui/skeleton";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import { ForecastWeather } from "openweather-api-node";
import { useEffect, useState } from "react";
let SunCalc = require('suncalc3');
export default function PhotoTimeDisplay({
  lat,
  lng,
  date,
  weather,

}: {
  lat: number
  lng: number
  date: Date
  weather: ForecastWeather[]
}) {
  //need to figure out about adding weather/time of day
  const [info, setInfo] = useState<PhotoTimeDisplayInfo[]>([])
  useEffect(() => {
    setInfo(buildPhotoTimeWidgetInfo(date))
  }, [date, weather])
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
      //checks if its within a day lol, should find a better way to see if the date is ok
      morningWeather = binarySearchWeather(weather, dateMorning);
      eveningWeather = binarySearchWeather(weather, dateEvening);
    }
    return { morningWeather, eveningWeather };
  }
  const buildPhotoTimeWidgetInfo = (date: Date) => {
    if (date && lat && lng) {
      let times = SunCalc.getSunTimes(date, lat, lng);
      let morningWeather = undefined;
      let eveningWeather = undefined;
      if (weather) {
        const weatherMassaged = weather.map(w => ({ conditionId: w.weather.conditionId, time: w.dt, temp: w.weather.temp.cur }));
        const closestWeathers = checkDateInWeatherRange(weatherMassaged, times.goldenHourDawnStart.value, times.goldenHourDuskEnd.value);
        morningWeather = closestWeathers.morningWeather;
        eveningWeather = closestWeathers.eveningWeather;
      }
      return [
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
      ];
    }
    else return [];
  }


  return (
    <div className="flex flex-col gap-4 pt-4">
      {
        info.map(info => <PhotoDisplayRow info={info} />)
      }
    </div>

  )
}

function PhotoDisplayRow({ info }: { info: PhotoTimeDisplayInfo }) {

  const dateToString = (date: Date) => {
    return date.toLocaleTimeString()
  }
  const timeLabelToString = (timeLabel: PhotoTime) => {
    switch (timeLabel) {
      case PhotoTime.golden_hour_morning:
        return "Golden Hour Morning";
      case PhotoTime.golden_hour_evening:
        return "Golden Hour Evening";
    }
  }
  return (
    <div className="flex flex-col gap-4 pt-4">

      < h1 className="font-semibold text-xl" > {timeLabelToString(info.time_label)}</h1 >
      <div className="flex flex-row gap-8">
        {info.weather ? <div className="align-center  p-4 rounded-md outline outline-2">

          {(info.weather == Weather.sun) && <TiWeatherSunny className="h-10 w-10" />}
          {info.weather == Weather.clouds && (
            <TiWeatherCloudy className="h-10 w-10" />
          )}
          {info.weather == Weather.rain && (
            <TiWeatherDownpour className="h-10 w-10" />
          )}
        </div> : <Skeleton className="align-center bg-black/10 p-4 h-16 w-16 rounded-md outline outline-2" />}
        <div className="align-center  p-4 rounded-md outline outline-2">
          <h1 className="text-left text-xl"> {dateToString(info.start)}</h1>
        </div>
        <div className="align-center gap-2 p-4 rounded-md outline outline-2">
          <h1 className="text-left text-xl"> {dateToString(info.end)}</h1>
        </div>
      </div>
    </div>
  )
}