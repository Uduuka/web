import React from "react";
import OrdersTable from "@/components/parts/tables/OrdersTable";
import { fetchOrders, getProfile } from "@/lib/actions";

export default async function OrdersPage() {
  const ordersPromise = fetchOrders();
  const profilePromise = getProfile();

  return (
    <OrdersTable
      profilePromise={profilePromise}
      ordersPromise={ordersPromise}
    />
  );
}
