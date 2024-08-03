import { parseAsArrayOf, parseAsFloat, parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

export default function ExploreBottomBar({ setDrawerOpen }: { setDrawerOpen: any }) {
  return (
    <div>
      <Card className="flex flex-col">
        <Button
          onClick={() => {
            setDrawerOpen(true);
          }}>
          {" "}
          Show Results
        </Button>
      </Card>
    </div>
  );
}
