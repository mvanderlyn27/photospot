"use client";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import TextSpinnerLoader from "../common/Loading";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { round } from "@/utils/common/math";
import { motion } from "framer-motion";
import InfiniteScrollGridItem from "./infiniteScrollGridItem";
import { isPhotoshot } from "@/utils/common/typeGuard";

export default function InfiniteScrollGrid({
  gridData,
  setSize,
  size,
  dataLoading,
  pageSize = 20,
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
  loadingMessage?: string;
  emptyMessage?: string;
  lastItemMessage?: string;
  loadingAnimation?: boolean;
  messageOnLastItem?: boolean;
  messageOnEmpty?: boolean;
}) {
  const containerRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
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
  const handleNewPhotoshot = () => {};
  const handleScroll = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const container: any = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView(() => bottom <= innerHeight);
    }
  };

  const handleDebouncedScroll = useDebouncedCallback(
    () => !isReachingEnd && handleScroll(),
    200
  );
  useEffect(() => {
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => {
      window.removeEventListener("scroll", handleDebouncedScroll);
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      loadMoreTickets();
    }
  }, [isInView]);
  useEffect(() => {
    if (isLoadingMore) {
      document
        .getElementById("loading")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoadingMore]);

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
    <>
      {gridData && (
        <div
          className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
          ref={containerRef}
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
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              >
                <InfiniteScrollGridItem
                  gridItemData={gridItem}
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
      {loadingAnimation && isLoadingMore && (
        <TimelineLoading message={loadingMessage} />
      )}
    </>
  );
}

const TimelineLoading = ({ message }: { message: string }) => {
  return (
    <div id="loading" className="flex flex-col items-center p-10">
      <TextSpinnerLoader text={message} />
    </div>
  );
};
const TimelineEnd = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold">{message}</h1>
    </div>
  );
};
const TimelineEmpty = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold">{message}</h1>
    </div>
  );
};
