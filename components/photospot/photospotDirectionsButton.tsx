import { cn } from "@/lib/utils";
import { FaDirections } from "react-icons/fa";
import { buttonVariants } from "../ui/button";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";

export default function PhotospotDirectionsButton({ id }: { id: number }) {
  const { data: photospot } = useSWR("/api/photospot/" + id, fetcher);
  const handleDirections = () => {
    if (photospot) {
      window.open(
        `https://www.google.com/maps?q=${photospot.lat},${photospot.lng}`
      );
    }
  };
  return (
    <div
      className={"cursor-pointer " + cn(buttonVariants({ variant: "default" }))}
      onClick={() => handleDirections()}
    >
      <FaDirections className="w-6 h-6" />
    </div>
  );
}
