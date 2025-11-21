"use client";

import {
  Heart,
  ShoppingBag,
  Star,
  Tag,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ReportsPage() {
  const cards = [
    {
      label: "Total Sales",
      value: "UGX 3,495,500",
      period: "2022 - 2023",
      trend: "+20%",
      positive: true,
      color: "from-purple-100 to-purple-50",
    },
    {
      label: "Total Orders",
      value: "232",
      period: "2022 - 2023",
      trend: "-11%",
      positive: false,
      color: "from-pink-100 to-pink-50",
    },
    {
      label: "Total clients",
      value: "200+",
      period: "2022 - 2023",
      trend: "+5%",
      positive: true,
      color: "from-blue-100 to-blue-50",
    },
    {
      label: "Revenue Growth",
      value: "UGX 500,000",
      period: "2022 - 2023",
      trend: "+10%",
      positive: true,
      color: "from-emerald-100 to-emerald-50",
    },
  ];

  const salesData = [
    { month: "Jan", totalSales: 400000, totalOrder: 500000, visitors: 300000 },
    { month: "Feb", totalSales: 450000, totalOrder: 650000, visitors: 350000 },
    { month: "Mar", totalSales: 350000, totalOrder: 480000, visitors: 280000 },
    { month: "Apr", totalSales: 550000, totalOrder: 750000, visitors: 450000 },
    { month: "May", totalSales: 500000, totalOrder: 600000, visitors: 420000 },
    { month: "Jun", totalSales: 600000, totalOrder: 700000, visitors: 480000 },
    { month: "Jul", totalSales: 350000, totalOrder: 420000, visitors: 300000 },
  ];

  const customerData = [
    { name: "Completed", value: 100 },
    { name: "Pending", value: 30 },
    { name: "Cancelled", value: 20 },
  ];

  const COLORS = ["#f97316", "#fed7aa", "#c2410c"];

  const categories = [
    {
      name: "Health & Beauty",
      icon: Heart,
      color: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    {
      name: "Mobile & Accessories",
      icon: Zap,
      color: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      name: "Electronics",
      icon: ShoppingBag,
      color: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    {
      name: "Fashion",
      icon: Star,
      color: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      name: "Subscription",
      icon: Users,
      color: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      name: "Deals & Tags",
      icon: Tag,
      color: "bg-purple-100",
      iconColor: "text-purple-500",
    },
  ];

  const realTimeData = [
    { time: "1k", value: 2000 },
    { time: "2k", value: 2500 },
    { time: "3k", value: 2800 },
    { time: "4k", value: 3200 },
    { time: "5k", value: 3800 },
    { time: "6k", value: 4200 },
  ];

  const orderData = [
    { name: "Complete", value: 70, fill: "#a855f7" },
    { name: "Cancel", value: 20, fill: "#ec4899" },
    { name: "Refunded", value: 10, fill: "#eab308" },
  ];

  const businessData = [
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 50000 },
    { month: "Mar", revenue: 45000 },
    { month: "Apr", revenue: 60000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 65000 },
    { month: "Jul", revenue: 70000 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-orange-50 border border-gray-200 rounded-lg p-6`}
          >
            <div className="text-sm text-gray-600 mb-4">{card.label}</div>
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-600">
                {card.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{card.period}</div>
            </div>
            <div className="flex items-center gap-2">
              {card.positive ? (
                <TrendingUp size={16} className="text-primary" />
              ) : (
                <TrendingDown size={16} className="text-error" />
              )}
              <span
                className={`text-sm font-medium ${
                  card.positive ? "text-primary" : "text-error"
                }`}
              >
                {card.trend} Since {card.positive ? "Last Month" : "Last Year"}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Sales statistics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Sales statistics */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Sales Statistic</h2>
            <select className="text-sm bg-white border border-gray-200 rounded px-3 py-1">
              <option>Last 01 Year</option>
            </select>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[1] }}
              ></div>
              <span className="text-sm text-gray-600">Total Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[0] }}
              ></div>
              <span className="text-sm text-gray-600">Total Order</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[2] }}
              ></div>
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                cursor={{ fill: "rgba(168, 85, 247, 0.1)" }}
              />
              <Bar
                dataKey="totalSales"
                fill={COLORS[1]}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalOrder"
                fill={COLORS[0]}
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="visitors" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Customers */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Customer</h2>

          <div className="flex flex-col items-center gap-4 mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {customerData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary">150%</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[0] }}
                ></div>
                <span className="text-gray-600">124 items</span>
              </div>
              <span className="text-gray-900 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[1] }}
                ></div>
                <span className="text-gray-600">124 items</span>
              </div>
              <span className="text-gray-900 font-medium">New</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[2] }}
                ></div>
                <span className="text-gray-600">124 items</span>
              </div>
              <span className="text-gray-900 font-medium">Unresolved</span>
            </div>
          </div>
        </div>

        {/* Product categories */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Product Categories
            </h2>
            <button className="text-gray-600 hover:text-gray-900">→</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className={`bg-orange-50 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity`}
              >
                <category.icon size={24} className="text-primary" />
                <span className="text-xs text-gray-700 text-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Realtime sales */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Real Time Sale
          </h2>

          <div className="flex gap-2 mb-4">
            {["Today", "15D", "1M", "6M", "1Y", "2Y"].map((label) => (
              <button
                key={label}
                className={`text-xs px-2 py-1 rounded ${
                  label === "Today"
                    ? "bg-orange-100 text-primary font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={realTimeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS[0]}
                vertical={false}
              />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Order Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Order Analysis
          </h2>

          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="w-full space-y-2">
              {orderData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[idx] }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Business Growth */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Business Growth
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={businessData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS[0]}
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="revenue" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS[2]}
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="text-center text-sm text-gray-600 mt-4">Revenue</div>
        </div>
      </div>
    </div>
  );
}
