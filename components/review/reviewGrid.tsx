"use client";
import { GridTypes, Review } from "@/types/photospotTypes";
import { Skeleton } from "../ui/skeleton";
import ReviewCard from "./review";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { getCols } from "@/utils/responsive/grids";
export default function ReviewGrid({ id, sort }: { id: number; sort: string }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photospot/${id}/reviews?pageCount=${index + 1}&sort=${sort}`,
    fetcher
  );
  console.log("search res", data);
  return (
    <div className="">
      <InfiniteScrollGrid
        gridData={data}
        gridType={GridTypes.review}
        setSize={setSize}
        size={size}
        colCount={getCols({ sm: 1, md: 1, lg: 1, xl: 1 })}
        dataLoading={photospotsLoading}
      />
    </div>
  );
}
