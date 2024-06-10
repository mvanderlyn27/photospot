import { Rating } from "react-simple-star-rating";
export default function RatingDisplay({
  rating,
  count,
}: {
  rating: number;
  count?: number | undefined;
}) {
  return (
    <div className="flex flex-row items-center">
      {count != 0 && <h2 className="text-xl text-gray-500">({rating})</h2>}
      <Rating
        initialValue={rating}
        readonly={true}
        SVGclassName={"inline-block"}
        size={25}
      />
      {count != undefined && (
        <h2 className="text-xl text-gray-500">
          ({count != 0 ? count : "no reviews yet"})
        </h2>
      )}
    </div>
  );
}
