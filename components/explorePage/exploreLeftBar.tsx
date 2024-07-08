"use client";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaLocationArrow } from "react-icons/fa";
import { FaSearchLocation } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
// import { useSearchParams } from "next/navigation";
export default function ExploreLeftBar({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: any;
}) {
  //   const searchParams = useSearchParams();
  //   const tab = searchParams.get("tab") ? searchParams.get("tab") : "";
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  return (
    <div className="h-full w-[50px] flex flex-col gap-8">
      <FaSearchLocation
        className={`cursor-pointer text-3xl m-auto fill-${
          selectedTab === "search" ? "primary" : "black"
        }`}
        onClick={() =>
          handleTabChange(selectedTab === "search" ? "" : "search")
        }
      />
      <FaLocationArrow
        className={`cursor-pointer text-3xl m-auto fill-${
          selectedTab === "nearby" ? "primary" : "black"
        }`}
        onClick={() =>
          handleTabChange(selectedTab === "nearby" ? "" : "nearby")
        }
      />

      <FaArrowAltCircleUp
        className={`cursor-pointer text-3xl m-auto fill-${
          selectedTab == "top" ? "primary" : "black"
        }`}
        onClick={() => handleTabChange(selectedTab === "top" ? "" : "top")}
      />
      <FaBookmark
        className={`cursor-pointer text-3xl m-auto fill-${
          selectedTab == "saved" ? "primary" : "black"
        }`}
        onClick={() => handleTabChange(selectedTab === "saved" ? "" : "saved")}
      />
    </div>
  );
}
