import React from "react";

export default function AdCardSkelton() {
  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative bg-secondary h-fit w-full overflow-hidden">
        <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 animate-pulse mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 animate-pulse mb-2 w-1/3"></div>
      </div>
    </div>
  );
}
