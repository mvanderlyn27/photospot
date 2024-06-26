import { PhotoTime, PhotoTimeWidgetInfo, Weather } from "@/types/photospotTypes";
import {
  TiWeatherDownpour,
  TiWeatherCloudy,
  TiWeatherSunny,
} from "react-icons/ti";
export default function PhotoTimeWidget({
  info,
}: {
  info: PhotoTimeWidgetInfo;
}) {
  //need to figure out about adding weather/time of day
  console.log("info", info);
  const timeLabelToString = (timeLabel: PhotoTime) => {
    switch (timeLabel) {
      case PhotoTime.golden_hour_morning:
        return "Golden Hour Morning";
      case PhotoTime.golden_hour_evening:
        return "Golden Hour Evening";
    }
  }

  const dateToString = (date: Date) => {
    console.log('formating date', date);
    return date.getHours() + ':' + date.getMinutes();
  }
  return (
    <div className="flex flex-row align-center gap-2 p-4 rounded-md outline outline-2">
      {info.weather == Weather.sun && <TiWeatherSunny className="h-10 w-10" />}
      {info.weather == Weather.clouds && (
        <TiWeatherCloudy className="h-10 w-10" />
      )}
      {info.weather == Weather.rain && (
        <TiWeatherDownpour className="h-10 w-10" />
      )}
      <div className="flex flex-col">
        <h1 className="font-semibold"> {timeLabelToString(info.time_label)}</h1>
        <h1 className="text-left"> {dateToString(info.time)}</h1>
      </div>
    </div>
  );
}
