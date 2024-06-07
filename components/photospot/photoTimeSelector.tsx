"use client"
import { Popover } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
export default function PhotoTimesSelector({
    setDate,
    date,
    today
}: {
    setDate: any,
    date: Date
    today: Date
}) {

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-none flex-row items-center gap-2 justify-left">
                <h1 className="text-2xl font-semibold">When are you going?</h1>
                <DatePicker date={date} setDate={setDate} today={today} />
            </div>
        </div>
    );
}

function DatePicker({
    date,
    setDate,
    today
}: {
    date: Date | undefined;
    setDate: any;
    today: Date
}) {
    const handleDisabledCheck = (date: Date) => {
        let dateLower = new Date(today);
        let dateUpper = new Date(today);
        dateLower.setDate(dateLower.getDate() - 1)
        dateUpper.setDate(dateUpper.getDate() + 5)
        return date < dateLower || date > dateUpper
    }
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
                    <Calendar mode="single" selected={date} onSelect={setDate} disabled={(date) => handleDisabledCheck(date)} />
                </div>
            </PopoverContent>
        </Popover>
    );
}
