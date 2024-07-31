"use client";
import {
  GridColumns,
  GridTypes,
  Photoshot,
  Photospot,
} from "@/types/photospotTypes";
import TextSpinnerLoader from "../common/Loading";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { round } from "@/utils/common/math";
import { motion } from "framer-motion";
import InfiniteScrollGridItem from "./infiniteScrollGridItem";
import { isPhotoshot } from "@/utils/common/typeGuard";
import useOnScreen from "@/hooks/react";

export default function InfiniteScrollGrid({
  gridData,
  setSize,
  size,
  dataLoading,
  pageSize = 20,
  height,
  colCount = { sm: 1, md: 2, lg: 3, xl: 5 },
  gridType = GridTypes.photoshot,
  loadingMessage = "Loading...   Loading...",
  emptyMessage = "Nothing here, check back later",
  loadingAnimation = true,
  messageOnLastItem = false,
  messageOnEmpty = true,
  lastItemMessage = "Reached the end, check back for more later",
}: {
  gridData: Photoshot[][] | Photospot[][] | undefined;
  setSize: (num: number) => void;
  size: number;
  dataLoading: boolean;
  pageSize?: number;
  height?: string;
  colCount?: GridColumns;
  gridType?: GridTypes;
  loadingMessage?: string;
  emptyMessage?: string;
  lastItemMessage?: string;
  loadingAnimation?: boolean;
  messageOnLastItem?: boolean;
  messageOnEmpty?: boolean;
}) {
  const ref = useRef(null);
  let loadingVisible = useOnScreen(ref);
  const isLoadingMore =
    dataLoading ||
    (size > 0 && gridData && typeof gridData[size - 1] === "undefined");
  const isEmpty = gridData?.[0]?.length === 0;
  const isReachingEnd =
    gridData &&
    gridData.length > 0 &&
    (gridData?.[0].length === 0 ||
      (gridData && gridData[gridData.length - 1]?.length < pageSize));
  // const isRefreshing = isValidating && data && data.length === size;

  useEffect(() => {
    console.log("visible?", loadingVisible);
    if (loadingVisible && !isLoadingMore) {
      loadMoreTickets();
    }
  }, [loadingVisible]);

  const loadMoreTickets = () => {
    setSize(size + 1);
  };
  const getExtraInfo = (data: Photoshot | Photospot | undefined) => {
    if (data) {
      if (data.dist_meters) {
        return round(data.dist_meters, 1) + " meters";
      } else if (isPhotoshot(data) && data.like_count) {
        return data.like_count + " ❤";
      }
    }
  };
  return (
    <div className="w-full flex flex-col md:pt-4 md:p-0">
      {gridData && (
        <div
          className={`w-full grid grid-cols-${colCount?.sm ? colCount?.sm : 1} 
          md:grid-cols-${colCount?.md ? colCount?.md : 2} 
          lg:grid-cols-${colCount?.lg ? colCount?.lg : 3}
           xl:grid-cols-${colCount?.xl ? colCount?.xl : 5} gap-4 md:gap-8`}
        >
          {gridData.flat().map((gridItem, i) => {
            const recalculatedDelay =
              i >= pageSize * 2 ? (i - pageSize * (size - 1)) / 15 : i / 15;
            return (
              <motion.div
                className="h-auto max-w-full"
                key={gridItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.25, 0, 1],
                  // delay: recalculatedDelay,
                  delay: 0.2,
                }}
                // whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              >
                <InfiniteScrollGridItem
                  gridItemData={gridItem}
                  gridType={gridType}
                  height={height}
                  extraInfo={getExtraInfo(gridItem)}
                />
              </motion.div>
            );
          })}
        </div>
      )}
      {messageOnEmpty && isEmpty && <TimelineEmpty message={emptyMessage} />}
      {messageOnLastItem && isReachingEnd && !isEmpty && (
        <TimelineEnd message={lastItemMessage} />
      )}
      <div ref={ref} className="w-full">
        {loadingAnimation && !isReachingEnd && !isEmpty && (
          <TimelineLoading message={loadingMessage} />
        )}
      </div>
    </div>
  );
}

const TimelineLoading = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 w-full">
      <TextSpinnerLoader text={message} />
    </div>
  );
};
const TimelineEnd = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold">{message}</h1>
    </div>
  );
};
const TimelineEmpty = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold">{message}</h1>
    </div>
  );
};
