import { Rating } from "react-simple-star-rating";
export default function RatingDisplay({
  rating,
  count,
}: {
  rating: number;
  count?: number | undefined;
}) {
  let countString = "";
  if (count !== undefined && count === 1) {
    countString = "1 review";
  } else if (count !== undefined && count > 1 && count <= 5) {
    countString = count + " reviews";
  } else {
    countString = "no reviews yet";
  }
  return (
    <div className="flex flex-row items-center">
      {count != 0 && <h2 className="text-xl text-gray-500 pr-4">{rating}</h2>}
      <Rating
        initialValue={rating}
        readonly={true}
        SVGclassName={"inline-block"}
        size={25}
      />
      {count != undefined && (
        <h2 className="text-xl text-gray-500 pl-4">{countString}</h2>
      )}
    </div>
  );
}
