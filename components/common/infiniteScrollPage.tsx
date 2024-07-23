"use client";
import {
  GridColumns,
  GridTypes,
  Photoshot,
  Photospot,
  Profile,
} from "@/types/photospotTypes";
import TextSpinnerLoader from "../common/Loading";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { round } from "@/utils/common/math";
import { motion } from "framer-motion";
import InfiniteScrollGridItem from "./infiniteScrollGridItem";
import { isPhotoshot } from "@/utils/common/typeGuard";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";

export default function InfiniteScrollPage({
  index,
  colCount = { sm: 1, md: 2, lg: 3, xl: 5 },
  gridType = GridTypes.photoshot,
  dataPath,
  setLoading,
  setNoMoreData,
  setEmpty,
}: {
  index: number;
  colCount?: GridColumns;
  gridType?: GridTypes;
  dataPath: string;
  setLoading: any;
  setNoMoreData: any;
  setEmpty: any;
}) {
  const { data, isLoading } = useSWR(`${dataPath}${index + 1}`, fetcher);
  console.log("data", data);
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
      console.log("data", data);
      if (!data) {
        console.log("emtpy data", data);
        setEmpty(true);
      } else if (data && data.length < 20) {
        console.log("data too small", data);
        setNoMoreData(true);
      }
    }
  }, [data]);
  return (
    <>
      {data && (
        <div
          className={`w-full grid sm:grid-cols-${
            colCount?.sm ? colCount?.sm : 1
          } 
          md:grid-cols-${colCount?.md ? colCount?.md : 2} 
          lg:grid-cols-${colCount?.lg ? colCount?.lg : 3}
           xl:grid-cols-${colCount?.xl ? colCount?.xl : 5} gap-8`}
        >
          {data.map((gridItem: Photoshot | Photospot | Profile, i: number) => {
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
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
