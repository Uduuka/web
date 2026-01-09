import CircularGraph from "@/components/parts/graphs/CircularGraph";
import GenericLineChart from "@/components/parts/graphs/LineChart";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import Chart from "./reports/PieChart";

const data = [
  {
    name: "Sept",
    visits: 4000,
    orders: 2400,
    amt: 2400,
  },
  {
    name: "Oct",
    visits: 3000,
    orders: 1398,
    amt: 2210,
  },
  {
    name: "Nov",
    visits: 2000,
    orders: 9800,
    amt: 2290,
  },
  {
    name: "Dec",
    visits: 2780,
    orders: 3908,
    amt: 2000,
  },
  {
    name: "Jan",
    visits: 1890,
    orders: 4800,
    amt: 2181,
  },
  {
    name: "Feb",
    visits: 2390,
    orders: 3800,
    amt: 2500,
  },
  {
    name: "Mar",
    visits: 3490,
    orders: 4300,
    amt: 2100,
  },
];

const customerData = [
  { name: "Completed", value: 100 },
  { name: "Pending", value: 30 },
  { name: "Cancelled", value: 20 },
];
const COLORS = ["#f97316", "#fed7aa", "#c2410c"];

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
        <h1>Total visits</h1>
        <p className="text-base flex items-center gap-5 text-primary">
          293{" "}
          <span className="text-xs text-success flex">
            (<ArrowUp size={15} /> 27 this month)
          </span>
        </p>
      </div>
      <div className="bg-white p-5 rounded-lg col-span-2 sm:col-span-2 xl:col-span-1">
        <h1>Total orders</h1>
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
        <h1 className="p-5 pl-8 text-accent/80 text-lg font-bold">
          Store visits and orders
        </h1>
        <GenericLineChart data={data} />
      </div>
      <div className="bg-white p-5 rounded-lg flex flex-col justify-center col-span-4 row-start-4 xl:row-start-2 xl:col-span-1 sm:col-span-2">
        <h1 className="font-bold text-lg text-gray-500">Reviews</h1>
        <Chart data={customerData} colors={COLORS} />
        {customerData.map((d, i) => (
          <p
            key={d.name}
            className="flex gap-2 text-xs text-gray-500 items-center"
          >
            <span
              className={`w-3 h-3 rounded-full`}
              style={{ backgroundColor: COLORS[i] }}
            />
            <span>{d.name}</span>
          </p>
        ))}
      </div>
      <div className="bg-white p-5 rounded-lg text-center col-span-4 row-start-5 sm:row-start-4 xl:row-start-3 xl:col-span-1 sm:col-span-2">
        <div className="p-3 rounded-md bg-gray-100">
          <div className="flex gap-2 items-center">
            <div className="h-10 w-10 rounded-full bg-secondary"></div>
            <div className="flex-1 text-left">
              <h1 className="text-gray-500 text-sm">Wafula Yakobo</h1>
              <p className="text-xs text-gray-400">
                {new Date().toDateString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-left pl-12">
            A wonderfull store. I got all I wanted in time and as exactly as I
            ordered.
          </p>
        </div>
      </div>
    </div>
  );
}
