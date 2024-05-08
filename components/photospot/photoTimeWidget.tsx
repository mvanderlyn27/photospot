import { PhotoTimeWidgetInfo, Weather } from "@/types/photospotTypes";
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
  const timeFromDate = info.time?.toTimeString().split(" ")[0];
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
        <h1 className="font-semibold"> Golden Hour (Morning) </h1>
        <h1 className="text-left"> {timeFromDate}</h1>
      </div>
    </div>
  );
}
