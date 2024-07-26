import { parseAsInteger, useQueryState } from "nuqs";
import PhotospotAutocomplete from "../photospot/photospotAutocomplete";
import { FormLabel } from "../ui/form";
import { Label } from "../ui/label";
import { Photospot } from "@/types/photospotTypes";

export default function PhotospotSearchForm({
  photospots,
  photospotsLoading,
}: {
  photospots: Photospot[][] | null;
  photospotsLoading: boolean;
}) {
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState(
    "selectedPhotospot",
    parseAsInteger
  );
  const setPhotospot = (id: number) => {
    setSelectedPhotospot(id);
  };
  return (
    <div className="p-4 w-full">
      <Label>Search by location name</Label>
      <PhotospotAutocomplete
        initialPhotospots={photospots}
        photospotsLoading={photospotsLoading}
        setSelectedPhotospot={setPhotospot}
        selectedPhotospot={selectedPhotospot}
      />
    </div>
  );
}
