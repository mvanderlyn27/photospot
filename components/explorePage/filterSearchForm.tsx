"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { IoMdLocate } from "react-icons/io";
import { useEffect, useState } from "react";
import { Tag } from "@/types/photospotTypes";
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
} from "nuqs";
import TagSelect from "../common/tagSelect";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RatingInput } from "../review/ratingInput";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
export const sortOptions = ["rating", "nearby", "new", ""];
const filterFormSchema = z.object({
  tags: z.array(z.number()),
  minRating: z.coerce.number().optional(),
  maxDistance: z
    .string()
    .refine((x) => x === "" || !isNaN(Number(x)), "enter a valid distance")
    .refine((x) => x === "" || (!isNaN(Number(x)) && Number(x) > 0), "must be greater than 0")
    .optional(),
  sort: z.string().refine((x) => sortOptions.includes(x)),
});
export default function FilterSearchForm({}: {}) {
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState("selectedPhotospot", parseAsInteger);
  const [sort, setSort] = useQueryState("sort", parseAsStringLiteral(sortOptions).withDefault(""));
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsInteger));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat);
  const [maxDistance, setMaxDistance] = useQueryState("maxDistance", parseAsFloat);
  const [userLocation, setUserLocation] = useQueryStates({
    lat: parseAsFloat.withDefault(40.73),
    lng: parseAsFloat.withDefault(-73.94),
  });

  useEffect(() => {
    if (userLocation) {
      setLocationAvailable(true);
    } else {
      getLocation();
    }
  }, []);
  const getLocation = () => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserLocation({ lat: coords.latitude, lng: coords.longitude });
          setLocationAvailable(true);
        },
        () => {
          setLocationAvailable(false);
        }
      );
    }
  };
  const getDefaults = () => {
    return {
      tags: tags ? tags : [],
      minRating: minRating != null ? minRating : undefined,
      maxDistance: maxDistance !== null ? maxDistance.toString() : "",
      sort: sort !== null ? sort : "",
    };
  };
  const form = useForm<z.infer<typeof filterFormSchema>>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: getDefaults(),
  });
  const onSubmit = (values: z.infer<typeof filterFormSchema>) => {
    console.log("values", values);
    setSelectedPhotospot(null);
    if (values.minRating) {
      setMinRating(values.minRating);
    } else {
      setMinRating(null);
    }
    if (values.maxDistance) {
      setMaxDistance(parseFloat(values.maxDistance));
    } else {
      setMaxDistance(null);
    }
    if (values.sort) {
      setSort(values.sort);
    } else {
      setSort(null);
    }
    if (values.tags) {
      setTags(values.tags);
    }
  };
  const setSelectedTags = (selectedTags: Tag[]) => {
    if (selectedTags) {
      form.setValue(
        "tags",
        selectedTags.map((t) => t.id)
      );
    } else {
      form.clearErrors("tags");
      form.setValue("tags", []);
    }
  };
  const setTagError = (tagError: Error) => {
    if (tagError) {
      form.setError("tags", {
        type: "manual",
        message: tagError.message,
      });
    } else {
      form.clearErrors("tags");
    }
  };
  const clear = (e: any) => {
    e.preventDefault();
    form.setValue("maxDistance", "");
    form.setValue("tags", []);
    form.setValue("minRating", 0);
    form.setValue("sort", "");
    form.setValue("minRating", 0);
    setMinRating(null);
    setMaxDistance(null);
    setTags(null);
    setSelectedPhotospot(null);
    setSort(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 md:space-y-8">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagSelect selectedTags={field.value} setSelectedTags={setSelectedTags} setTagError={setTagError} />
              </FormControl>
              <FormDescription>Enter the name of the photospot you want to find.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxDistance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Distance (meters)</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-4">
                  <Input disabled={!locationAvailable} placeholder="enter distance" {...field} />
                  <Button onClick={() => getLocation()}>
                    <IoMdLocate size={20} />
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Maximum distance away you want a location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Rating</FormLabel>
              <FormControl>
                <RatingInput
                  initialVal={field.value}
                  onChange={(rate: number | undefined) => {
                    console.log("rate", rate, field.value);
                    if (rate === field.value) {
                      field.onChange(0);
                    } else {
                      field.onChange(rate);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>Minimum rating you want for results</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort Results</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  size="lg"
                  variant="outline"
                  className="w-full flex flex-row justify-between"
                  onValueChange={field.onChange}
                  value={field.value}>
                  {/* <h1 className="text-xl font-bold pr-2">Filter: </h1> */}
                  <ToggleGroupItem
                    value="rating"
                    aria-label="toggle rating"
                    className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1 ">
                    Rating
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    disabled={!locationAvailable}
                    value="nearby"
                    aria-label="toggle nearby"
                    className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1">
                    Nearby
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="new"
                    aria-label="toggle new"
                    className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1">
                    New
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormDescription>Options to filter photospot.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-4 justify-center items-center">
          <Button
            className="text-xl"
            variant="destructive"
            onClick={(e) => {
              return clear(e);
            }}>
            Clear
          </Button>
          <Button className="text-xl" type="submit">
            Apply
          </Button>
        </div>
      </form>
    </Form>
  );
}
