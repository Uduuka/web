import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/parts/layout/Navbar";
import Footer from "@/components/parts/layout/Footer";
import Sidebar from "@/components/parts/layout/SideBar";
import ActiveChats from "@/components/parts/buttons/ActiveChats";
import BottomNav from "@/components/parts/layout/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Doline - Shop Local, Trade Smart</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
        <meta
          name="description"
          content="Hyper-local marketplace connecting buyers and sellers in thier neighborhood."
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
          <BottomNav />
          <ActiveChats />
        </Suspense>
      </body>
    </html>
  );
}
