"use client";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { User } from "@supabase/supabase-js";
import { LngLat } from "mapbox-gl";
import { retrieveLocation, suggestLocations } from "@/app/serverActions/maps/searchLocationByName";
import { useDebouncedCallback } from "use-debounce";
import { SearchBoxFeatureSuggestion, SearchBoxSuggestion } from "@mapbox/search-js-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MdOutlineCancel } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
type Framework = Record<"value" | "label", string>;

interface Props {
    currentSearch: boolean;
    onChange?: (values: SearchBoxFeatureSuggestion) => void;
    user: User | null;
    mapCenter: LngLat;
    setViewingPhotospot: any
}

export const LocationAutoComplete = ({ currentSearch, onChange, user, mapCenter, setViewingPhotospot }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<SearchBoxFeatureSuggestion | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectables, setSelectables] = useState<SearchBoxSuggestion[]>([]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {

                // This is not a default behaviour of the <input /> field
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        []
    );


    useEffect(() => {
        if (selected) {
            onChange?.(selected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    const suggestLocation = (query: string) => {
        console.log('search location', query);
        if (query) {
            suggestLocations(query, user?.id, mapCenter, undefined).then(suggestions => {
                if (suggestions) {
                    console.log('suggestions', suggestions);
                    setSelectables(suggestions);
                    setOpen(true);
                }
            });
        }
        // else if (selectables) {
        //     setSelectables([]);
        //     setOpen(false);
        // }
    }
    const debouncedSuggestLocation = useDebouncedCallback((query: string) => {
        suggestLocation(query);
    }, 250);
    const retrieveLocationInfo = (suggestion: SearchBoxSuggestion) => {
        //maybe add loading state, and put back into the promise
        setInputValue(suggestion.name);
        retrieveLocation(suggestion, user?.id).then(feature => {
            console.log('got data for feature', feature);
            setSelected(feature);
            setOpen(false);
        })
    }

    return (
        <>

            <TooltipProvider>
                {/* Avoid having the "Search" Icon */}


                <div className="flex flex-row gap-1 relative "
                    onKeyDown={handleKeyDown}
                >
                    <Input
                        className="h-12 text-xl"
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); debouncedSuggestLocation(e.target.value) }}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Search for a location"
                    />
                    <div className="absolute h-full right-0">
                        {currentSearch && <Tooltip >
                            <TooltipTrigger asChild  >
                                <Button variant="ghost" className="h-full hover:bg-clear group" onClick={() => { setViewingPhotospot(null); setSelected(null); setInputValue("") }} ><MdOutlineCancel className="h-6 w-6 group-hover:fill-primary" /></Button>
                            </TooltipTrigger>
                            <TooltipContent >
                                <p>Clear</p>
                            </TooltipContent>
                        </Tooltip>
                        }
                    </div>

                </div >
            </TooltipProvider >

            <div className="relative mt-2">
                {open && selectables.length > 0 &&
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <div className="flex flex-col h-full overflow-auto bg-background">
                            {selectables && selectables.map((suggestion) =>
                                <div
                                    className="bg-background cursor-pointer hover:bg-backgroundHover p-2"
                                    key={suggestion.mapbox_id}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => {
                                        retrieveLocationInfo(suggestion);
                                    }}
                                >
                                    {suggestion.name}
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </>
    );
};