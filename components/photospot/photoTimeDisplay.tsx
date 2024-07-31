import {
  PhotoTime,
  PhotoTimeDisplayInfo,
  Weather,
} from "@/types/photospotTypes";
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
import { useBreakpoint } from "@/hooks/tailwind";
let SunCalc = require("suncalc3");
export default function PhotoTimeDisplay({
  lat,
  lng,
  date,
  weather,
  columnView,
}: {
  lat: number;
  lng: number;
  date: Date;
  weather: ForecastWeather[];
  columnView?: boolean;
}) {
  //need to figure out about adding weather/time of day
  const [info, setInfo] = useState<PhotoTimeDisplayInfo[]>([]);
  useEffect(() => {
    setInfo(buildPhotoTimeWidgetInfo(date));
  }, [date, weather]);
  const convertWeather = (curWeather: number): Weather | undefined => {
    if (String(curWeather).startsWith("8")) {
      if (curWeather === 800) {
        return Weather.sun;
      }
      return Weather.clouds;
    }
    if (String(curWeather).startsWith("2")) {
      return Weather.storm;
    }
    if (String(curWeather).startsWith("3")) {
      return Weather.drizzle;
    }
    if (String(curWeather).startsWith("5")) {
      return Weather.rain;
    }
    if (String(curWeather).startsWith("6")) {
      return Weather.snow;
    }
  };
  const binarySearchWeather = (
    weather: { conditionId: number; time: Date; temp: number }[],
    date: Date
  ) => {
    let start = 0;
    let end = weather.length - 1;
    while (start < end) {
      let mid = Math.round((start + end) / 2);
      let midDate = new Date(weather[mid].time);
      if (midDate < date) {
        start = mid + 1;
      } else if (midDate > date) {
        end = mid - 1;
      } else {
        return weather[mid];
      }
    }
    return weather[start];
  };
  const checkDateInWeatherRange = (
    weather: { conditionId: number; time: Date; temp: number }[] | undefined,
    dateMorning: Date,
    dateEvening: Date
  ) => {
    let morningWeather = undefined;
    let eveningWeather = undefined;
    if (weather && date) {
      //checks if its within a day lol, should find a better way to see if the date is ok
      morningWeather = binarySearchWeather(weather, dateMorning);
      eveningWeather = binarySearchWeather(weather, dateEvening);
    }
    return { morningWeather, eveningWeather };
  };
  const buildPhotoTimeWidgetInfo = (date: Date) => {
    if (date && lat && lng) {
      let times = SunCalc.getSunTimes(date, lat, lng);
      let morningWeather = undefined;
      let eveningWeather = undefined;
      if (weather) {
        const weatherMassaged = weather.map((w) => ({
          conditionId: w.weather.conditionId,
          time: w.dt,
          temp: w.weather.temp.cur,
        }));
        const closestWeathers = checkDateInWeatherRange(
          weatherMassaged,
          times.goldenHourDawnStart.value,
          times.goldenHourDuskEnd.value
        );
        morningWeather = closestWeathers.morningWeather;
        eveningWeather = closestWeathers.eveningWeather;
      }
      return [
        {
          start: times.goldenHourDawnStart.value,
          end: times.goldenHourDawnEnd.value,
          time_label: PhotoTime.golden_hour_morning,
          weather: morningWeather
            ? convertWeather(morningWeather.conditionId)
            : undefined,
          temp: morningWeather ? morningWeather.temp : undefined,
        },
        {
          start: times.goldenHourDuskStart.value,
          end: times.goldenHourDuskEnd.value,
          time_label: PhotoTime.golden_hour_evening,
          weather: eveningWeather
            ? convertWeather(eveningWeather.conditionId)
            : undefined,
          temp: eveningWeather ? eveningWeather.temp : undefined,
        },
      ];
    } else return [];
  };
  return (
    <div className={`flex ${columnView ? "flex-col" : "flex-row"} gap-4 pt-4`}>
      {info.map((info) => (
        <PhotoDisplayRow
          info={info}
          columnView={columnView}
          weather={weather}
        />
      ))}
    </div>
  );
}

function PhotoDisplayRow({
  info,
  columnView,
  weather,
}: {
  info: PhotoTimeDisplayInfo;
  columnView?: boolean;
  weather: any;
}) {
  const dateToString = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const timeLabelToString = (timeLabel: PhotoTime) => {
    switch (timeLabel) {
      case PhotoTime.golden_hour_morning:
        return "Golden Hour Morning";
      case PhotoTime.golden_hour_evening:
        return "Golden Hour Evening";
    }
  };
  const { isSm } = useBreakpoint("sm");
  return (
    <div
      className={`flex flex-col gap-4 p-0 md:pt-4 ${
        columnView ? "" : "border-2 border-black p-4 rounded-lg"
      }`}
    >
      <h1 className={`font-semibold ${!isSm ? "text-md" : "text-xl"}`}>
        {" "}
        {timeLabelToString(info.time_label)}
      </h1>
      <div className="flex flex-row gap-4 md:gap-8">
        {weather && info.weather ? (
          <div className="align-center p-0 md:p-4 rounded-md outline outline-1 md:outline-2">
            {info.weather == Weather.sun && (
              <TiWeatherSunny className="h-8 w-8 md:h-10 md:w-10" />
            )}
            {info.weather == Weather.clouds && (
              <TiWeatherCloudy className="h-8 w-8 md:h-10 md:w-10" />
            )}
            {info.weather == Weather.rain && (
              <TiWeatherDownpour className="h-8 w-8 md:h-10 md:w-10" />
            )}
          </div>
        ) : (
          <Skeleton className="align-center bg-black/10 p-2 md:p-4 h-16 w-16 rounded-md outline outline-1 md:outline-2" />
        )}
        {weather && info.weather ? (
          <div className="align-center p-2 md:p-4 rounded-md outline outline-1 md:outline-2">
            {info.temp && (
              <h1 className="text-left text-sm md:text-xl">
                {" "}
                {Math.round(info.temp)} F°
              </h1>
            )}
          </div>
        ) : (
          <Skeleton className="align-center bg-black/10 p-2 md:p-4 h-16 w-16 rounded-md outline outline-1 md:outline-2" />
        )}
        <div className="align-center  p-2 md:p-4 rounded-md outline outline-1 md:outline-2">
          <h1 className="text-left text-sm md:text-xl">
            {" "}
            {dateToString(info.start)}
          </h1>
        </div>
        <div className="align-center gap-2  p-2 md:p-4 rounded-md outline outline-1 md:outline-2">
          <h1 className="text-left text-sm md:text-xl">
            {" "}
            {dateToString(info.end)}
          </h1>
        </div>
      </div>
    </div>
  );
}
