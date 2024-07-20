"use client";
import { useForm } from "react-hook-form";
import TagSelect from "../common/tagSelect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { IoMdLocate } from "react-icons/io";
import { TagOption } from "../common/createTagSelect";
import { useEffect, useState } from "react";
import { MultiValue } from "react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Photospot, Tag } from "@/types/photospotTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TextSpinnerLoader from "../common/Loading";
import PhotospotAutocomplete from "../photospot/photospotAutocomplete";
import { RatingInput } from "../review/ratingInput";
export const sortOptions = ["rating", "nearby", "new", ""];
const filterFormSchema = z.object({
  tags: z.array(z.number()),
  minRating: z.coerce.number().optional(),
  maxDistance: z
    .string()
    .refine((x) => x === "" || !isNaN(Number(x)), "enter a valid distance")
    .refine(
      (x) => x === "" || (!isNaN(Number(x)) && Number(x) > 0),
      "must be greater than 0"
    )
    .optional(),
  sort: z.string().refine((x) => sortOptions.includes(x)),
  sortDir: z.string().refine((x) => ["asc", "desc", ""].includes(x)),
});
export default function FilterSearchForm() {
  const [loading, setLoading] = useState(false);
  const [locationAvailable, setLocationAvailable] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  useEffect(() => {
    if (params.get("lat") && params.get("lng")) {
      setLocationAvailable(true);
    } else {
      getLocation();
    }
    // fetch('/api/photospot/nearby?lat=40.73&lng=-73.94').then(res => res.json()).then(data => {
    //     setInitialPhotoshots(data);
    // })
  }, []);
  const getLocation = () => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          console.log("lat", latitude, "long", longitude);
          params.set("lat", latitude.toString());
          params.set("lng", longitude.toString());
          replace(`${pathname}?${params.toString()}`);
          setLocationAvailable(true);
        },
        () => {
          setLocationAvailable(false);

          //   setLocation({ latitude: 40.73, longitude: -73.94 });
        }
      );
    }
  };
  const getDefaults = () => {
    let tagsRaw = params.getAll("tags");
    let minRatingRaw = params.get("minRating");
    let maxDistanceRaw = params.get("maxDistance");
    let sortRaw = params.get("sort");
    let sortDirRaw = params.get("sortDir");
    let tags = tagsRaw.map((x) => parseInt(x));
    let minRating = minRatingRaw ? parseInt(minRatingRaw) : 0;
    let maxDistance = maxDistanceRaw ? maxDistanceRaw : "";
    let sort = sortRaw ? sortRaw : "";
    let sortDir = sortDirRaw ? sortDirRaw : "";
    return {
      tags: tags,
      minRating: minRating,
      maxDistance: maxDistance,
      sort: sort,
      sortDir: sortDir,
    };
  };
  const form = useForm<z.infer<typeof filterFormSchema>>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: getDefaults(),
  });
  const onSubmit = (values: z.infer<typeof filterFormSchema>) => {
    const params = new URLSearchParams(searchParams);
    if (values.minRating) {
      params.set("minRating", values.minRating.toString());
    } else {
      params.delete("minRating");
    }
    if (values.maxDistance) {
      params.set("maxDistance", values.maxDistance.toString());
    } else {
      params.delete("maxDistance");
    }
    if (values.sort) {
      params.set("sort", values.sort);
      if (values.sortDir) {
        params.set("sortDir", values.sortDir);
      } else {
        params.delete("sortDir");
      }
    } else {
      params.delete("sort");
      params.delete("sortDir");
    }
    if (values.tags) {
      params.delete("tags");
      values.tags.forEach((t) => params.append("tags", t.toString()));
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const setSelectedTags = (selectedTags: Tag[]) => {
    console.log("selectedTags", selectedTags);
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
    console.log("tagError", tagError);
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
    const params = new URLSearchParams(searchParams);
    e.preventDefault();
    params.delete("minRating");
    params.delete("maxDistance");
    params.delete("sortDir");
    params.delete("sort");
    params.delete("tags");
    replace(`${pathname}?${params.toString()}`);
    form.reset();
    //double check this comes down and clears out
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagSelect
                  selectedTags={field.value}
                  setSelectedTags={setSelectedTags}
                  setTagError={setTagError}
                />
              </FormControl>
              <FormDescription>
                Enter the name of the photospot you want to find.
              </FormDescription>
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
                  <Input
                    disabled={!locationAvailable}
                    placeholder="enter distance"
                    {...field}
                  />
                  <Button onClick={() => getLocation()}>
                    <IoMdLocate size={20} />
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Maximum distance away you want a location
              </FormDescription>
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
              <FormDescription>
                Minimum rating you want for results
              </FormDescription>
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
                  value={field.value}
                >
                  {/* <h1 className="text-xl font-bold pr-2">Filter: </h1> */}
                  <ToggleGroupItem
                    value="rating"
                    aria-label="toggle rating"
                    className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1 "
                  >
                    Rating
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    disabled={!locationAvailable}
                    value="nearby"
                    aria-label="toggle nearby"
                    className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1"
                  >
                    Nearby
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="new"
                    aria-label="toggle new"
                    className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1"
                  >
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
            }}
          >
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
