"use client";

import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Sept",
    sites: 4000,
    clients: 2400,
    amt: 2400,
  },
  {
    name: "Oct",
    sites: 3000,
    clients: 1398,
    amt: 2210,
  },
  {
    name: "Nov",
    sites: 2000,
    clients: 9800,
    amt: 2290,
  },
  {
    name: "Dec",
    sites: 2780,
    clients: 3908,
    amt: 2000,
  },
  {
    name: "Jan",
    sites: 1890,
    clients: 4800,
    amt: 2181,
  },
  {
    name: "Feb",
    sites: 2390,
    clients: 3800,
    amt: 2500,
  },
  {
    name: "Mar",
    sites: 3490,
    clients: 4300,
    amt: 2100,
  },
];

export default class GenericLineChart extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/p/sandbox/line-chart-width-xaxis-padding-8v7952";

  render() {
    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={300}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="clients"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="sites" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
