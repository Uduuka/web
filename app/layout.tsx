"use client";

import "./globals.css";
import { Suspense, useEffect } from "react";
import Navbar from "@/components/parts/layout/Navbar";
import Footer from "@/components/parts/layout/Footer";
import { useAppStore } from "@/lib/store";
import Sidebar from "@/components/parts/layout/SideBar";
import { CartItem, Currency } from "@/lib/types";
import ActiveChats from "@/components/parts/buttons/ActiveChats";
import { setCookie } from "@/lib/actions";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCart, cart } = useAppStore();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCookie(
            "location",
            JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
          );
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
    const currency = localStorage.getItem("currency") as Currency;
    const cartItems = localStorage.getItem("cart_items");

    setCookie("currency", currency ?? "UGX");
    if (cartItems) {
      const items: CartItem[] = JSON.parse(cartItems) ?? [];
      setCart?.({ ...cart, items, store: items[0]?.store });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Uduuka - Shop Local, Trade Smart</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
        <meta
          name="description"
          content="Hyper-local marketplace connecting buyers and sellers in your neighborhood."
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/android-chrome-192x192.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-inter font-light text-sm">
        <Suspense>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 md:ml-64 overflow-auto">
              <div className="min-h-screen">{children}</div>
              <Footer />
            </main>
          </div>
          <ActiveChats />
        </Suspense>
      </body>
    </html>
  );
}
