import { parseAsArrayOf, parseAsFloat, parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { FaChevronUp } from "react-icons/fa";

export default function ExploreBottomBar({
  setDrawerOpen,
  setActiveSnapPoint,
}: {
  setDrawerOpen: any;
  setActiveSnapPoint: any;
}) {
  return (
    <Card
      className="cursor-pointer flex flex-row justify-between w-full p-4 "
      onClick={(e) => {
        e.stopPropagation();
        setActiveSnapPoint(1);
        setDrawerOpen(true);
      }}>
      <h1>Show Results</h1>
      <FaChevronUp className="w-6 h-6 z-top " />
    </Card>
  );
}
