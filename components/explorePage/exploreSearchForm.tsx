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
import { TagOption } from "../common/createTagSelect";
import { useState } from "react";
import { MultiValue } from "react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Photospot, Tag } from "@/types/photospotTypes";
import PhotospotResult from "./photospotResult";
export const filterOptions = ["nearby", "top", "saved", ""];
const formSchema = z.object({
  photospotName: z.string().optional(),
  searchMode: z
    .string()
    .refine((val) => filterOptions.some((el) => el === val))
    .optional(),
  tags: z.array(z.number()),
});
export default function ExploreSearchForm({
  photospotName,
  searchMode,
  tags,
}: {
  photospotName: string;
  searchMode: string;
  tags: number[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photospotName: photospotName,
      searchMode: searchMode,
      tags: tags,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams(searchParams);
    if (values.photospotName) {
      params.set("photospotQueryName", values.photospotName);
    } else {
      params.delete("photospotQueryName");
    }
    if (values.searchMode) {
      params.set("searchMode", values.searchMode);
    } else {
      params.delete("searchMode");
    }

    params.delete("tags");
    if (values.tags) {
      values.tags.forEach((t) => params.append("tags", t.toString()));
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    replace(`${pathname}?${params.toString()}`);
    console.log(values);
  }
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
    e.preventDefault();
    form.setValue("photospotName", "");
    form.setValue("searchMode", "");
    form.setValue("tags", []);
    // setSelectedLocation(null);
    // setSelectedTags([]);
    replace(`${pathname}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>Current Search</AccordionTrigger>
        <AccordionContent className="w-full p-4 flex flex-col gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="searchMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Filter</FormLabel>
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
                          value="nearby"
                          aria-label="toggle nearby"
                          className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1 "
                        >
                          Nearby
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="top"
                          aria-label="toggle top"
                          className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1"
                        >
                          Top
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="saved"
                          aria-label="toggle saved"
                          className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1"
                        >
                          Saved
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormDescription>
                      Options to filter photospot.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photospotName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photospot Name</FormLabel>
                    <FormControl>
                      <Input placeholder="enter name" {...field} />
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
              <div className="flex flex-row gap-4 justify-center items-center">
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    return clear(e);
                  }}
                >
                  Clear
                </Button>
                <Button type="submit">Apply</Button>
              </div>
            </form>
          </Form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
