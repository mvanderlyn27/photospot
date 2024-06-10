import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

export function RatingInput({
  initialVal,
  onChange,
}: {
  initialVal: number;
  onChange: any;
}) {
  const [rating, setRating] = useState(0);

  // Catch Rating value
  const handleRating = (rate: number) => {
    setRating(rate);
    onChange(rate);
  };

  return (
    <div className="App">
      {/* set initial value */}
      <Rating
        onClick={handleRating}
        initialValue={rating}
        SVGclassName={"inline-block"}
        transition={true}
        size={25}
      />
    </div>
  );
}
