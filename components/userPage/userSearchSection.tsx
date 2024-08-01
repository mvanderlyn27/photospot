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
import { useBreakpoint } from "@/hooks/tailwind";
import { CiSearch } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { getCols } from "@/utils/responsive/grids";

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
    console.log("input entered", inputValue);
    setSearchQuery(inputValue);
    router.push(`/user?search=${inputValue}`);
  };
  const handleClear = () => {
    console.log("clearing");
    router.replace("/user");
    setSearchQuery("");
    setInputValue("");
  };
  const { isSm } = useBreakpoint("sm");
  return (
    <div className="w-full flex flex-col items-center justify-start m-4">
      <Card className=" xl:w-1/5">
        <div className="flex flex-row gap-4 p-4">
          <Input
            value={inputValue}
            placeholder="User Search"
            onChange={(e) => {
              console.log("input", e.target.value, inputValue);
              setInputValue(e.target.value);
            }}
            className="text-xl"
          />
          <Button onClick={() => handleSearch()}>
            <CiSearch className="w-6 h-6 md:w-8 md:h-8" />
          </Button>
          <Button onClick={() => handleClear()} variant="destructive">
            <MdClear className="w-6 h-6 md:w-8 md:h-8" />
          </Button>
        </div>
      </Card>
      {searchQuery && (
        <div className=" h-full xl:w-1/5">
          <InfiniteScrollGrid
            gridData={data}
            gridType={GridTypes.following}
            setSize={setSize}
            size={size}
            dataLoading={isLoading}
            colCount={getCols({ sm: 1, md: 1, lg: 1, xl: 1 })}
          />
        </div>
      )}
    </div>
  );
}
