import CircularGraph from "@/components/parts/graphs/CircularGraph";
import GenericLineChart from "@/components/parts/graphs/LineChart";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

export default function MyStorePage() {
  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="bg-white p-5 rounded-lg col-span-2 sm:col-span-2 xl:col-span-1">
        <h1>Total ads</h1>
        <p className="text-base flex items-center gap-5 text-primary">
          <span>109 </span>
          <span className="text-xs text-success flex line-clamp-1">
            (<ArrowUp size={15} /> 12 this month)
          </span>
        </p>
      </div>
      <div className="bg-white p-5 rounded-lg col-span-2 sm:col-span-2 xl:col-span-1">
        <h1>Total likes</h1>
        <p className="text-base flex items-center gap-5 text-primary">
          293{" "}
          <span className="text-xs text-success flex">
            (<ArrowUp size={15} /> 27 this month)
          </span>
        </p>
      </div>
      <div className="bg-white p-5 rounded-lg col-span-2 sm:col-span-2 xl:col-span-1">
        <h1>Total dislikes</h1>
        <p className="text-base flex items-center gap-5 text-primary">
          19{" "}
          <span className="text-xs text-error flex">
            (<ArrowDown size={15} /> 3 this month)
          </span>
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg col-span-2 sm:col-span-2 xl:col-span-1">
        <h1>Average rating</h1>
        <p className="text-base flex items-center gap-5 text-primary">
          3.7 <span className="text-xs text-success flex">(12 this month)</span>
        </p>
      </div>
      <div className="bg-white rounded-lg p-5 col-span-4 xl:col-span-3 xl:row-start-2 row-span-2">
        <h1 className="p-5 pl-8 text-accent/80 ">
          Sales and purchases over the past months
        </h1>
        <GenericLineChart />
      </div>
      <div className="bg-white p-5 rounded-lg flex flex-col justify-center col-span-4 row-start-4 xl:row-start-2 xl:col-span-1 sm:col-span-2">
        <CircularGraph />
      </div>
      <div className="bg-white p-5 rounded-lg text-center col-span-4 row-start-5 sm:row-start-4 xl:row-start-3 xl:col-span-1 sm:col-span-2">
        <h1 className="text-xl text-primary">28</h1>
        <p className="text-accent">Reviews in total</p>
      </div>
    </div>
  );
}
