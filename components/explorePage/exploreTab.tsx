import TagSelect from "../common/tagSelect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

//role :
// allow user to enter filters
// retrieve photospots based on filter
// allow user to select a photospot
export default function ExploreTab({
  setSelectedLocation,
  setPhotospotOptions,
}: {
  setSelectedLocation: any;
  setPhotospotOptions: any;
}) {
  let tagValues = null;
  let setTagValues = null;
  let setSelectedTags = null;
  let setTagError = null;
  //have filters for search, other ones don't have filters
  return (
    <div className="flex flex-col w-[400px] p-4">
      <h1 className="text-3xl font-bold">Explore Photospots</h1>
      {/* <Input placeholder="Search" /> */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Current Search</AccordionTrigger>
          <AccordionContent className="w-full p-4 flex flex-col gap-8">
            <ToggleGroup
              type="single"
              size="lg"
              variant="outline"
              className="w-full flex flex-row justify-between"
            >
              {/* <h1 className="text-xl font-bold pr-2">Filter: </h1> */}
              <ToggleGroupItem
                value="nearby"
                aria-label="toggle nearby"
                className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1 "
              >
                Nearby
              </ToggleGroupItem>
              <ToggleGroupItem
                value="top"
                aria-label="toggle top"
                className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1"
              >
                Top
              </ToggleGroupItem>
              <ToggleGroupItem
                value="saved"
                aria-label="toggle saved"
                className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white flex-1"
              >
                Saved
              </ToggleGroupItem>
            </ToggleGroup>
            {/* <ToggleGroup
              type="single"
              size="lg"
              variant="outline"
              className="w-full flex flex-row  items-left"
            >
              <h1 className="text-xl font-bold pr-2">Time: </h1>
              <ToggleGroupItem
                value="day"
                aria-label="toggle nearby"
                className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white  "
              >
                Day
              </ToggleGroupItem>
              <ToggleGroupItem
                value="week"
                aria-label="toggle top"
                className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white "
              >
                Week
              </ToggleGroupItem>
              <ToggleGroupItem
                value="month"
                aria-label="toggle saved"
                className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white "
              >
                Month
              </ToggleGroupItem>
              <ToggleGroupItem
                value="all"
                aria-label="toggle saved"
                className="hover:bg-transparent data-[state=on]:bg-primary data-[state=on]:text-white "
              >
                All
              </ToggleGroupItem>
            </ToggleGroup> */}
            <Input placeholder="Photospot Name" />
            <TagSelect
            //   tagValues={tagValues}
            //   setTagValues={setTagValues}
            //   setSelectedTags={setSelectedTags}
            //   setTagError={setTagError}
            />

            <div className="flex flex-row gap-4 justify-center items-center">
              <Button variant="destructive">Clear</Button>
              <Button>Apply</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <Separator className="my-4" /> */}
      <div>Results section</div>
    </div>
  );
}
