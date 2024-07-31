import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Button } from "../ui/button";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";

export default function SavePhotospotButton({ id }: { id: number }) {
  const {
    data: photospot,
    isLoading: photospotLoading,
    error: photospotError,
  } = useSWR("/api/photospot/" + id, fetcher);
  const {
    data: isSaved,
    mutate: updateSaved,
    isLoading: savedLoading,
    error: savedError,
  } = useSWR("/api/photospot/" + id + "/isSaved", fetcher);
  const handleSave = async () => {
    return fetch("/api/photospot/" + id + "/save", { method: "post" }).then(
      (res) => true
    );
  };
  const handleUnsave = async () => {
    return fetch("/api/photospot/" + id + "/unSave", { method: "post" }).then(
      (res) => false
    );
  };
  const handleUpdateSaved = async () => {
    if (!photospot) return;
    if (isSaved) {
      console.log("un saveing ");
      updateSaved(handleUnsave(), { optimisticData: false });
    } else {
      console.log("saving");
      updateSaved(handleSave(), { optimisticData: true });
    }
  };
  return (
    <Button
      className="h-full"
      onClick={() => handleUpdateSaved()}
      disabled={savedLoading}
    >
      {isSaved ? (
        <FaBookmark className="w-6 h-6" />
      ) : (
        <FaRegBookmark className="w-6 h-6" />
      )}
    </Button>
  );
}
