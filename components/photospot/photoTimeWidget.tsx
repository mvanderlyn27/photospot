import { PhotoTime, PhotoTimeWidgetInfo, Weather } from "@/types/photospotTypes";
import {
  TiWeatherDownpour,
  TiWeatherCloudy,
  TiWeatherSunny,
} from "react-icons/ti";
import { Skeleton } from "../ui/skeleton";
export default function PhotoTimeWidget({
  info,
}: {
  info: PhotoTimeWidgetInfo;
}) {
  //need to figure out about adding weather/time of day
  const timeLabelToString = (timeLabel: PhotoTime) => {
    switch (timeLabel) {
      case PhotoTime.golden_hour_morning:
        return "Golden Hour Morning";
      case PhotoTime.golden_hour_evening:
        return "Golden Hour Evening";
    }
  }

  const dateToString = (date: Date) => {
    return date.toLocaleTimeString()
  }
  return (
    <div className="flex flex-col gap-4 pt-4">

      < h1 className="font-semibold text-xl" > {timeLabelToString(info.time_label)}</h1 >
      <div className="flex flex-row gap-8">
        {info.weather != undefined && <div className="align-center  p-4 rounded-md outline outline-2">

          {info.weather == Weather.sun && <TiWeatherSunny className="h-10 w-10" />}
          {info.weather == Weather.clouds && (
            <TiWeatherCloudy className="h-10 w-10" />
          )}
          {info.weather == Weather.rain && (
            <TiWeatherDownpour className="h-10 w-10" />
          )}
        </div>}
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
