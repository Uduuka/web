"use client";

import Navbar from "@/components/parts/layout/Navbar";
import Footer from "@/components/parts/layout/Footer";
import "./globals.css";
import { useAppStore } from "@/lib/store";
import { useEffect, useTransition } from "react";
import Sidebar from "@/components/parts/layout/SideBar";
import Popup from "@/components/ui/Popup";
import Button from "@/components/ui/Button";
import { getProfile, getUser } from "@/lib/actions";
import { Currency } from "@/lib/types";
import { geoCode } from "@/lib/utils";
import ChatPanel from "@/components/parts/sidePanels/ChatPanel";
import ActiveChats from "@/components/parts/buttons/ActiveChats";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fetching, startFetching] = useTransition();
  const { setLocation, setCurrency, setUser, setProfile } = useAppStore();

  useEffect(() => {
    startFetching(async () => {
      const { error, data } = await getUser();
      if (data.user) {
        setUser(data.user);
        const prof = await getProfile(data.user?.id);

        setProfile(prof.data);
      }
    });
  }, []);

  useEffect(() => {
    setCurrency((localStorage.getItem("currency") as Currency) ?? "UGX");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            coordinates: [position.coords.longitude, position.coords.longitude],
          });
        },
        async (error) => {
          console.log("Geolocation error:", error);
          try {
            const { lat, lon, currency } = await geoCode();
            setLocation({
              latitude: lat,
              longitude: lon,
              coordinates: [lon, lat],
            });
            setCurrency(currency);
          } catch (error) {
            console.log(error);
          }
        }
      );
    } else {
      console.log("Geolocation not supported");
      (async () => {
        try {
          const { lat, lon, currency } = await geoCode();
          setLocation({
            latitude: lat,
            longitude: lon,
            coordinates: [lon, lat],
          });
          setCurrency(currency);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [setLocation, setCurrency]);

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
        <Navbar fetchingUser={fetching} />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 md:ml-64 overflow-auto">
            <div className="min-h-screen">{children}</div>
            <Footer />
          </main>
        </div>
        <ActiveChats />
      </body>
    </html>
  );
}
