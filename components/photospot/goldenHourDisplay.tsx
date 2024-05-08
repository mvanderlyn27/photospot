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

export default function GoldenHourDisplay({
  lat,
  lng,
  photoTypes,
}: {
  lat: number | undefined;
  lng: number | undefined;
  photoTypes: PhotoTime[] | undefined;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [photoTimeWidgetInfos, setPhotoTimeWidgetInfos] = useState<
    PhotoTimeWidgetInfo[] | undefined
  >([]);
  useEffect(() => {
    //update photoTimeWidgetInfos here based on which types of photos
    console.log("date", date);
    if (date) {
      const hoursToAdd = 8 * 60 * 60 * 1000;
      const date2 = new Date();
      date2.setTime(date.getTime() + hoursToAdd);
      setPhotoTimeWidgetInfos([
        {
          time: date,
          time_label: PhotoTime.golden_hour_morning,
          weather: Weather.sun,
        },
        {
          time: date2,
          time_label: PhotoTime.golden_hour_evening,
          weather: Weather.clouds,
        },
      ]);
    }
  }, [date, lat, lng]);
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
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
