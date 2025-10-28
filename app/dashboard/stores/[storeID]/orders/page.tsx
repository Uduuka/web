import OrdersTable from "@/components/parts/tables/OrdersTable";
import { fetchOrders, getProfile } from "@/lib/actions";
import React from "react";
interface PageProps {
  params: Promise<{ storeID: string }>;
}

export default async function OrdersPage({ params }: PageProps) {
  const { storeID } = await params;
  const ordersPromise = fetchOrders(storeID);
  const profilePromise = getProfile();

  return (
    <OrdersTable
      profilePromise={profilePromise}
      ordersPromise={ordersPromise}
    />
  );
}
