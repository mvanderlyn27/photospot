"use client"
import { Tag } from '@/types/photospotTypes';
import { fetcher } from '@/utils/common/fetcher';
import { NSFWTextMatcher } from '@/utils/common/obscenity';
import React, { useState } from 'react';
import { MultiValue } from 'react-select';

import AsyncCreatableSelect from 'react-select/async-creatable';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
export interface TagOption {
    readonly label: string;
    readonly value: number;
}
// TODO:
// - add better styling to match other form info
export const createOption = (tag: Tag): TagOption => (
    {
        label: tag.name ? tag.name : '',
        value: tag.id ? tag.id : -1,
    });

export default function TagSelect({ tagValues, setTagValues, setSelectedTags, setTagError }: { tagValues: MultiValue<TagOption> | null, setTagValues: any, setSelectedTags: any, setTagError: any }) {
    const { data: tags, isLoading: tagLoading, mutate: updateTags, error: tagsError } = useSWR('/api/tags', fetcher)
    const [isLoading, setIsLoading] = useState(false);
    // const [values, setValues] = useState<MultiValue<Option> | null>(initialSelectedTags ? initialSelectedTags.map((tag) => createOption(tag)) : null);

    // CREATE SECTION
    const handleCreate = async (inputValue: string) => {
        setIsLoading(true);
        if (!inputValue.match(/^[a-zA-Z]+$/)) {
            console.log('invalid input');
            setTagError(new Error('Invalid tag name only strings allowed'));
            setIsLoading(false);
            return
        }
        if (NSFWTextMatcher.hasMatch(inputValue)) {
            console.log('NSFW text');
            setTagError(new Error('Invalid tag name no profanity allowed'));
            setIsLoading(false);
            return
        }
        //tag should be good
        let tag: Tag = await fetch('/api/tags/create', {
            method: 'POST',
            body: JSON.stringify({ name: inputValue })
        }).then(res => res.json());
        //hadle state updates 
        const newOption = createOption(tag);
        await updateTags();
        setTagValues(tagValues ? [...tagValues, newOption] : [newOption]);
        setIsLoading(false);
    }
    // SEARCH SECTION
    const searchTags = async (inputValue: string) => {
        setTagError(null);
        return fetch('/api/tags/search', {
            method: 'POST',
            body: JSON.stringify({ name: inputValue }),
            cache: 'no-store'
        }).then(async (res) => {
            let data = await res.json();
            return data.map((tag: Tag) => createOption(tag))
        });
    }
    const _searchTags = (inputValue: string, callback: any) => {
        searchTags(inputValue).then((data) => {
            callback(data);
        })
    }
    // HANDLE CHANGE SECTION
    const handleChange = (newValue: MultiValue<TagOption> | null) => {
        setTagError(null);
        setSelectedTags(newValue ? newValue.map((option) => option.value) : []);
        setTagValues(newValue);
    }
    const debouncedSearch = useDebouncedCallback(_searchTags, 300);
    return (
        <AsyncCreatableSelect
            isClearable
            isMulti
            isDisabled={isLoading || tagLoading}
            isLoading={isLoading || tagLoading}
            onChange={handleChange}
            onCreateOption={handleCreate}
            defaultOptions={tags ? tags.map((tag: Tag) => createOption(tag)) : []}
            // defaultValue={values ? values.filter((option) => initialSelectedTags?.includes(option.value)) : []}
            blurInputOnSelect
            loadOptions={debouncedSearch}
            value={tagValues}
            styles={{
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: '#f7f4e9',
                }),
                menu: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: '#f7f4e9',
                }),
                option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isFocused ? '#FAC898' : '#f7f4e9',
                }),
            }}

        />
    )
}
