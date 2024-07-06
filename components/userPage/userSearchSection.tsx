"use client";
import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import { GridTypes } from "@/types/photospotTypes";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

//needs a search bar, and section to view results
export default function UserSearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [inputValue, setInputValue] = useState<string>(search ? search : "");
  const [searchQuery, setSearchQuery] = useState<string>(search ? search : "");
  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite(
      (index) =>
        `/api/profile/user?username_query=${searchQuery}&pageCount=${
          index + 1
        }`,
      fetcher
    );
  const handleSearch = () => {
    router.push(`/user?search=${inputValue}`);
    setSearchQuery(inputValue);
  };
  return (
    <div className="flex flex-row justify-center">
      <Card className="flex flex-col gap-4 xl:w-1/5">
        <div className="flex flex-row gap-4 p-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="text-xl"
          />
          <Button onClick={() => handleSearch()}>Search</Button>
        </div>
        {searchQuery && (
          <InfiniteScrollGrid
            gridData={data}
            gridType={GridTypes.following}
            setSize={setSize}
            size={size}
            dataLoading={isLoading}
            colCount={{ sm: 1, md: 1, lg: 3, xl: 3 }}
          />
        )}
      </Card>
    </div>
  );
}
