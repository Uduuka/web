"use client";

import type { Metadata } from "next";
import Navbar from "@/components/parts/layout/Navbar";
import Footer from "@/components/parts/layout/Footer";
import "./globals.css";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";
import Sidebar from "@/components/parts/layout/SideBar";
import Popup from "@/components/ui/Popup";
import Button from "@/components/ui/Button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLocation, setCurrency, filters } = useAppStore();

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  useEffect(() => {
    setCurrency(localStorage.getItem("currency") ?? "UGX");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          setLocation(null);
        }
      );
    } else {
      console.log("Geolocation not supported");
      setLocation(null);
    }
  }, [setLocation, setCurrency]);
  return (
    <html lang="en">
      <head>
        <title>Uduuka - Shop Local, Trade Smart</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <meta
          name="description"
          content="Hyper-local marketplace connecting buyers and sellers in your neighborhood."
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/android-chrome-192x192.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-inter font-light text-sm">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 md:ml-64 overflow-auto">
            <div className="min-h-screen">{children}</div>
            <Footer />
          </main>
        </div>
        <div className="fixed bottom-5 right-5">
          <Popup
            trigger={
              <Button className="bg-accent text-background w-14 h-14 shadow-lg rounded-full">
                5 chats
              </Button>
            }
            align="diagonal-left"
            contentStyle="w-80 bg-secondary h-96"
          >
            <div className="h-20"></div>
          </Popup>
        </div>
      </body>
    </html>
  );
}
