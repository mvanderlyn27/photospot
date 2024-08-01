"use client";
import { useBreakpoint } from "@/hooks/tailwind";
import { GridColumns } from "@/types/photospotTypes";
export const getCols = (cols: GridColumns = {}) => {
  const { isSm } = useBreakpoint("sm");
  const { isMd } = useBreakpoint("md");
  const { isLg } = useBreakpoint("lg");
  const { isXl } = useBreakpoint("xl");

  if (!isSm) {
    console.log("sm", cols.sm);
    return cols.sm || 2;
  } else if (!isMd) {
    console.log("md", cols.md);
    return cols.md || 3;
  } else if (!isLg) {
    console.log("lg", cols.lg);
    return cols.lg || 4;
  } else if (!isXl) {
    console.log("xl", cols.xl);
    return cols.xl || 5;
  } else return 5;
};
