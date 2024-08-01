"use client";
import { useBreakpoint } from "@/hooks/tailwind";
import { GridColumns } from "@/types/photospotTypes";
export const getCols = (cols: GridColumns = {}) => {
  const columnVariants: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-3",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  };
  const { isSm } = useBreakpoint("sm");
  const { isMd } = useBreakpoint("md");
  const { isLg } = useBreakpoint("lg");
  const { isXl } = useBreakpoint("xl");
  if (!isSm) {
    if (cols.sm) {
      return columnVariants[cols.sm];
    } else {
      return columnVariants[2];
    }
  } else if (!isMd) {
    if (cols.md) {
      return columnVariants[cols.md];
    } else {
      return columnVariants[2];
    }
  } else if (!isLg) {
    if (cols.lg) {
      return columnVariants[cols.lg];
    } else {
      return columnVariants[3];
    }
  } else if (!isXl) {
    if (cols.xl) {
      return columnVariants[cols.xl];
    } else {
      return columnVariants[5];
    }
  } else return columnVariants[5];
};
