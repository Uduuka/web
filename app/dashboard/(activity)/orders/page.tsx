import OrdersTable from "@/components/parts/tables/OrdersTable";
import { fetchOrders } from "@/lib/actions";
import { StoreOrder } from "@/lib/types";
import React from "react";
interface PageProps {
  params: Promise<{ storeID: string }>;
}

export default async function OrdersPage({ params }: PageProps) {
  const { data, error } = await fetchOrders();
  const orders: StoreOrder[] = data ?? [];

  return <OrdersTable data={orders} />;
}
