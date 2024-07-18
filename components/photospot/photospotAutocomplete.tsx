"use client";
import { Photospot } from "@/types/photospotTypes";
import { fetcher } from "@/utils/common/fetcher";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RxComponentPlaceholder } from "react-icons/rx";
import { MultiValue } from "react-select";
import AsyncSelect from "react-select/async";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

export type PhotospotOption = {
  readonly label: string;
  readonly value: number;
};
export const createOption = (photospot: Photospot): PhotospotOption => ({
  label: photospot.location_name ? photospot.location_name : "",
  value: photospot.id ? photospot.id : -1,
});
export default function PhotospotAutocomplete() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const selectedPhotospotRaw = params.get("selectedPhotospot");
  const selectedPhotospot = selectedPhotospotRaw
    ? parseInt(selectedPhotospotRaw)
    : undefined;
  console.log("selectedPhotospot", selectedPhotospot);
  const {
    data: photospots,
    isLoading: photospotsLoading,
    mutate: updatePhotospots,
    error: photospotsError,
  } = useSWR("/api/photospot", fetcher);
  // SEARCH SECTION
  const [isLoading, setIsLoading] = useState(false);
  const searchTags = async (inputValue: string) => {
    // setTagError(null);
    return fetch(`/api/photospot/search?photospotName=${inputValue}`, {
      method: "POST",
      cache: "no-store",
    }).then(async (res) => {
      let data = await res.json();
      return data.map((photospot: Photospot) => createOption(photospot));
    });
  };
  const _searchTags = (inputValue: string, callback: any) => {
    searchTags(inputValue).then((data) => {
      callback(data);
    });
  };
  // HANDLE CHANGE SECTION
  const handleChange = (newValue: PhotospotOption | null) => {
    // setTagError(null);
    console.log("updating", newValue);
    if (!newValue) {
      params.delete("selectedPhotospot");
    } else {
      params.set("selectedPhotospot", String(newValue?.value));
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const debouncedSearch = useDebouncedCallback(_searchTags, 300);
  return (
    <AsyncSelect
      isClearable
      maxMenuHeight={400}
      menuPlacement="bottom"
      isDisabled={isLoading || photospotsLoading}
      isLoading={isLoading || photospotsLoading}
      onChange={handleChange}
      defaultOptions={
        photospots
          ? photospots.map((photospot: Photospot) => createOption(photospot))
          : []
      }
      value={
        photospots && selectedPhotospot !== undefined
          ? createOption(
              photospots.filter(
                (photospot: Photospot) => selectedPhotospot === photospot.id
              )[0]
            )
          : []
      }
      // defaultValue={values ? values.filter((option) => initialSelectedphotospotss?.includes(option.value)) : []}
      blurInputOnSelect
      loadOptions={debouncedSearch}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "#f7f4e9",
        }),
        menu: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "#f7f4e9",
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isFocused ? "#FAC898" : "#f7f4e9",
        }),
      }}
    />
  );
}
