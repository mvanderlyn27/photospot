"use client";
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";

export function RatingInput({
  initialVal,
  onChange,
}: {
  initialVal: number | undefined;
  onChange: any;
}) {
  const [value, setlVal] = useState(initialVal);
  useEffect(() => {
    setlVal(initialVal);
  }, [initialVal]);
  // Catch Rating value
  const handleRating = (rate: number) => {
    onChange(rate);
  };

  return (
    <div className="App">
      {/* set initial value */}
      <Rating
        onClick={handleRating}
        initialValue={
          initialVal && initialVal > 0 && initialVal <= 5 ? initialVal : 0
        }
        SVGstyle={{ display: "inline" }}
        transition={true}
        size={25}
      />
    </div>
  );
}
