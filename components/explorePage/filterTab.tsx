import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import FilterSearchForm from "./filterSearchForm";
import PhotospotSearchResults from "./photospotSearchResults";
import { Photospot } from "@/types/photospotTypes";

export default function FilterTab({
  photospots,
  photospotsLoading,
  setSize,
}: {
  photospots: Photospot[][] | null;
  photospotsLoading: boolean;
  setSize: any;
}) {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="flex flex-none w-full p-4"
      >
        <AccordionItem value="item-1" className="w-full ">
          <AccordionTrigger>Current Search</AccordionTrigger>
          <AccordionContent>
            <FilterSearchForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-1 min-h-0 w-full">
        {!photospots && !photospotsLoading ? (
          <h1 className="w-full text-xl text-center font-semibold p-4">
            Start a search above
          </h1>
        ) : (
          <PhotospotSearchResults
            photospots={photospots ? photospots : undefined}
            setSize={setSize}
            photospotsLoading={photospotsLoading}
          />
        )}
      </div>
    </div>
  );
}
