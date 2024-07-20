import CreateReviewDialog from "../review/createReviewDialog";
import ReviewGrid from "../review/reviewGrid";

export default function PhotospotReviewSection({ id }: { id: number }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-row justify-end w-full">
        {/*button for making review/mutating review route */}
        <CreateReviewDialog id={id} />
      </div>
      <div className="w-[40%]">
        <ReviewGrid id={id} sort="high" />
      </div>
    </div>
  );
}
