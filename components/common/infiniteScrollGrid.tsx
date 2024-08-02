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
import { useInView } from "react-intersection-observer";

export default function InfiniteScrollGrid({
  gridData,
  setSize,
  size,
  dataLoading,
  pageSize = 20,
  height,
  colCount = "",
  gridType = GridTypes.photoshot,
  loadingMessage = "Loading...   Loading...",
  emptyMessage = "Nothing here, check back later",
  loadingAnimation = true,
  messageOnLastItem = false,
  messageOnEmpty = true,
  lastItemMessage = "Reached the end, check back for more later",
  showDetails = false,
}: {
  gridData: Photoshot[][] | Photospot[][] | undefined;
  setSize: (num: number) => void;
  size: number;
  dataLoading: boolean;
  pageSize?: number;
  height?: string;
  colCount?: string;
  gridType?: GridTypes;
  loadingMessage?: string;
  emptyMessage?: string;
  lastItemMessage?: string;
  loadingAnimation?: boolean;
  messageOnLastItem?: boolean;
  messageOnEmpty?: boolean;
  showDetails?: boolean;
}) {
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
  const { ref, inView, entry } = useInView({});
  useEffect(() => {
    if (inView && !isLoadingMore) {
      loadMoreTickets();
    }
  }, [inView]);

  const loadMoreTickets = () => {
    setSize(size + 1);
  };
  const getExtraInfo = (data: Photoshot | Photospot | undefined) => {
    if (data) {
      if (data.dist_meters) {
        return round(data.dist_meters, 1) + " m";
      } else if (isPhotoshot(data) && data.like_count) {
        return data.like_count + " ❤";
      }
    }
  };
  return (
    <div className="w-full flex flex-col md:pt-4 md:p-0">
      {gridData && (
        <div
          className={`w-full grid ${colCount}
           gap-4 md:gap-8`}
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
                  showDetails={showDetails}
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
