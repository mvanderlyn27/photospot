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
import ExploreSearchForm from "./exploreSearchForm";

//role :
// allow user to enter filters
// retrieve photospots based on filter
// allow user to select a photospot

export default function ExploreTab({
  photospotNameQuery,
  searchMode,
  tags,
  setSelectedLocation,
  photospotOptions,
}: {
  photospotNameQuery: string;
  searchMode: string;
  tags: number[];
  setSelectedLocation: any;
  photospotOptions: Photospot[];
}) {
  console.log("photospotNameQuery", photospotNameQuery);
  //have filters for search, other ones don't have filters
  return (
    <div className="flex flex-col w-[500px] p-4 gap-4 h-full min-h-0">
      <h1 className="text-3xl font-bold">Explore Photospots</h1>
      {/* <Input placeholder="Search" /> */}
      <ExploreSearchForm
        photospotName={photospotNameQuery}
        searchMode={searchMode}
        tags={tags}
      />
      {/* List of photospots */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col  gap-4 ">
          {photospotOptions.map((photospot) => (
            <PhotospotResult
              key={photospot.id}
              photospot={photospot}
              setSelectedLocation={setSelectedLocation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
