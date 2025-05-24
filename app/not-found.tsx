import React from "react";

export default function notfound() {
  return (
    <div className="w-full min-h-96 flex justify-center items-center">
      <div className="bg-yellow-50 text-warning p-5 rounded-lg text">
        <h1 className="text-lg">
          Oops, we could not find what you are looking for!
        </h1>
      </div>
    </div>
  );
}
