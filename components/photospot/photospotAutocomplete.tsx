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
export default function PhotospotAutocomplete({
  initialPhotospots,
  photospotsLoading,
  selectedPhotospot,
  setSelectedPhotospot,
}: {
  initialPhotospots: Photospot[][] | null;
  photospotsLoading: boolean;
  selectedPhotospot: number | null;
  setSelectedPhotospot: any;
}) {
  // const {
  //   data: photospots,
  //   isLoading: photospotsLoading,
  //   mutate: updatePhotospots,
  //   error: photospotsError,
  // } = useSWR("/api/photospot", fetcher);
  // SEARCH SECTION
  const [isLoading, setIsLoading] = useState(photospotsLoading);
  const searchTags = async (inputValue: string) => {
    // setTagError(null);
    return fetch(`/api/photospot/search?photospotName=${inputValue}`, {
      method: "GET",
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
      setSelectedPhotospot(null);
    } else {
      setSelectedPhotospot(newValue?.value);
    }
  };
  const debouncedSearch = useDebouncedCallback(_searchTags, 300);
  return (
    <AsyncSelect
      isClearable
      maxMenuHeight={400}
      menuPlacement="bottom"
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleChange}
      defaultOptions={
        initialPhotospots
          ? initialPhotospots
              .flat()
              .map((photospot: Photospot) => createOption(photospot))
          : []
      }
      value={
        initialPhotospots && selectedPhotospot !== null
          ? createOption(
              initialPhotospots
                .flat()
                .filter(
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
