import { Rating } from "react-simple-star-rating";
export default function RatingDisplay({
  rating,
  count,
  size,
  font,
}: {
  rating: number;
  count?: number | undefined;
  size?: number;
  font?: string;
}) {
  let countString = "";
  // if (count !== undefined && count === 1) {
  //   countString = "1 review";
  // } else if (count !== undefined && count > 1 && count <= 5) {
  //   countString = count + " reviews";
  // } else {
  //   countString = "no reviews yet";
  countString = `(${count})`;
  // }
  return (
    <div className="flex flex-row items-center">
      {count != 0 && <h2 className={`${font ? font : "text-xl"} text-gray-500 pr-2 md:pr-4`}>{rating}</h2>}
      <Rating initialValue={rating} readonly={true} SVGclassName={"inline-block"} size={size ? size : 25} />
      {count != undefined && <h2 className={`${font ? font : "text-xl"} text-gray-500 pl-2 md:pl-4`}>{countString}</h2>}
    </div>
  );
}
