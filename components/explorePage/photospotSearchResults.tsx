"use client";
import { fetcher } from "@/utils/common/fetcher";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import InfiniteScrollPage from "../common/infiniteScrollPage";
import { parseAsInteger, useQueryState } from "nuqs";
import { LoadingIndicator } from "react-select/dist/declarations/src/components/indicators";
import TextSpinnerLoader from "../common/Loading";
import { useEffect, useRef, useState } from "react";
import useOnScreen from "@/hooks/react";

export default function PhotospotSearchResults() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.delete("page");
  const url = `/api/photospot/search?${params.toString()}&pageCount=`;
  const [cnt, setCnt] = useQueryState("page", parseAsInteger.withDefault(0));
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  //no data left to load
  //no data
  const loaderRef = useRef(null);
  const isVisible = useOnScreen(loaderRef);
  useEffect(() => {
    console.log("info", loading, isVisible, noMoreData, empty);
    if (!loading && isVisible && !noMoreData && !empty) {
      setLoading(true);
      setCnt(cnt + 1);
    }
  }, [isVisible]);
  let pages = [];
  for (let i = 0; i < cnt; i++) {
    pages.push(
      <InfiniteScrollPage
        index={i}
        key={i}
        dataPath={url}
        colCount={{ sm: 1, md: 1, lg: 1, xl: 1 }}
        gridType={GridTypes.photospotSearch}
        setNoMoreData={setNoMoreData}
        setEmpty={setEmpty}
        setLoading={setLoading}
      />
    );
  }
  console.log("pages", pages);
  return (
    <div className="w-full flex flex-col gap-4">
      {pages}
      <div ref={loaderRef} className="w-full flex justify-center p-4 min-h-5">
        {loading && <TextSpinnerLoader text={"Loading"} />}
        {noMoreData && (
          <h1 className="text-xl font-bold">
            No more photospots, check back later
          </h1>
        )}
        {empty && (
          <h1 className="text-xl font-bold"> No photospots, upload one now!</h1>
        )}
      </div>
    </div>
  );
}
