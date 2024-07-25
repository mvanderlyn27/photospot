import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import FilterSearchForm from "./filterSearchForm";
import PhotospotSearchResults from "./photospotSearchResults";

export default function FilterTab() {
  //   const [loadMore, setLoadMore] = useQueryState(
  //     "loadMore",
  //     parseAsBoolean.withDefault(true)
  //   );
  //   const [loading, setLoading] = useQueryState(
  //     "loading",
  //     parseAsBoolean.withDefault(false)
  //   );
  const [end, setEnd] = useQueryState("end", parseAsBoolean.withDefault(false));
  const [empty, setEmpty] = useQueryState(
    "empty",
    parseAsBoolean.withDefault(false)
  );
  const [maxDistance, setMaxDistance] = useQueryState(
    "maxDistance",
    parseAsFloat
  );
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault(""));
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsInteger));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat);
  const [userLocation, setUserLocation] = useQueryStates({
    lat: parseAsFloat.withDefault(40.73),
    lng: parseAsFloat.withDefault(-73.94),
  });
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
            <FilterSearchForm
              tags={tags}
              setTags={setTags}
              minRating={minRating}
              setMinRating={setMinRating}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              sort={sort}
              setSort={setSort}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {(tags && tags.length > 0) ||
      minRating !== null ||
      maxDistance !== null ||
      sort !== "" ? (
        <div className="flex flex-1 min-h-0 w-full">
          <PhotospotSearchResults
            tags={tags}
            minRating={minRating}
            maxDistance={maxDistance}
            sort={sort}
            userLocation={userLocation}
          />
        </div>
      ) : (
        <h1 className="text-xl font-semibold text-center w-full">
          Search for a photospot above
        </h1>
      )}
    </div>
  );
}
