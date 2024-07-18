"use client";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { TagOption, createOption } from "./createTagSelect";
import { Tag } from "@/types/photospotTypes";
import { useDebouncedCallback } from "use-debounce";
import { MultiValue } from "react-select";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
export default function TagSelect({
  selectedTags,
  setSelectedTags,
  setTagError,
}: {
  selectedTags?: number[];
  setSelectedTags: any;
  setTagError: any;
}) {
  /*
    component handles tag loading/selection, but no creation
    */
  const {
    data: tags,
    isLoading: tagLoading,
    mutate: updateTags,
    error: tagsError,
  } = useSWR("/api/tags", fetcher);
  // SEARCH SECTION
  const [isLoading, setIsLoading] = useState(false);
  const searchTags = async (inputValue: string) => {
    setTagError(null);
    return fetch("/api/tags/search", {
      method: "POST",
      body: JSON.stringify({ name: inputValue }),
      cache: "no-store",
    }).then(async (res) => {
      let data = await res.json();
      return data.map((tag: Tag) => createOption(tag));
    });
  };
  const _searchTags = (inputValue: string, callback: any) => {
    searchTags(inputValue).then((data) => {
      callback(data);
    });
  };
  // HANDLE CHANGE SECTION
  const handleChange = (newValue: MultiValue<TagOption> | null) => {
    setTagError(null);
    setSelectedTags(
      newValue
        ? newValue.map((option) => ({ id: option.value, name: option.label }))
        : []
    );
  };
  const debouncedSearch = useDebouncedCallback(_searchTags, 300);
  return (
    <AsyncSelect
      isMulti
      isClearable
      maxMenuHeight={200}
      menuPlacement="bottom"
      isDisabled={isLoading || tagLoading}
      isLoading={isLoading || tagLoading}
      onChange={handleChange}
      defaultOptions={tags ? tags.map((tag: Tag) => createOption(tag)) : []}
      value={
        tags && selectedTags
          ? tags
              .filter((tag: Tag) => selectedTags.includes(tag.id))
              .map((tag: Tag) => createOption(tag))
          : []
      }
      // defaultValue={values ? values.filter((option) => initialSelectedTags?.includes(option.value)) : []}
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
