import PhotospotAutocomplete from "../photospot/photospotAutocomplete";
import { FormLabel } from "../ui/form";
import { Label } from "../ui/label";

export default function PhotospotSearchForm() {
  return (
    <div className="p-4 w-full">
      <Label>Search by location name</Label>
      <PhotospotAutocomplete />
    </div>
  );
}
