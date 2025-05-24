"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Store,
  Tag,
  ChevronDown,
  ChevronRight,
  MapPin,
  StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ScrollArea from "./ScrollArea";
import CategoryButton from "../buttons/CategoryButton";
import { categories } from "@/lib/dev_db/db";
import FilterCard from "../cards/FiltersCard";
import { IoMdFlash } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { useAppStore } from "@/lib/store";
import { FcAdvertising } from "react-icons/fc";
import { GoMegaphone } from "react-icons/go";
import { BsChatRightText } from "react-icons/bs";
import { BiBell, BiStore } from "react-icons/bi";
import { SlBell } from "react-icons/sl";
import { PiStorefront, PiTrashSimpleLight } from "react-icons/pi";
import { IoTrashBin } from "react-icons/io5";
import { CiTrash } from "react-icons/ci";
import { title } from "process";

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState(true);

  const { user } = useAppStore();

  const navItems = [
    { url: "/dashboard", title: "Dashboard", icon: <RxDashboard size={18} /> },
    {
      url: "/dashboard/store",
      title: "My store",
      icon: <PiStorefront size={20} />,
      subNavs: [
        { url: "/dashboard/store", title: "Overview" },
        { url: "/dashboard/store/ads", title: "Ads" },
        { url: "/dashboard/store/sales", title: "Sales" },
        { url: "/dashboard/store/purchases", title: "Purchases" },
        { url: "/dashboard/store/reports", title: "Reports" },
      ],
    },
    {
      url: "/dashboard/chats",
      title: "Chats",
      icon: <BsChatRightText size={18} />,
    },
    {
      url: "/dashboard/notifications",
      title: "Notifications",
      icon: <SlBell size={20} />,
    },

    {
      url: "/dashboard/trash",
      title: "Trash bin",
      icon: <PiTrashSimpleLight size={20} />,
    },
  ];

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white font-light text-xs z-30 hidden md:block">
      {pathname.startsWith("/dashboard") ? (
        <div className="flex-1 min-h-[91vh] w-full flex flex-col py-5 px-2">
          <div className="text-accent w-full border-b border-accent/60 pb-5">
            <div className="w-20 h-20 rounded-full bg-secondary mx-auto"></div>
            <h1 className="text-center py-2">{user?.username}</h1>
            <p className="text-center w-full">({user?.email})</p>
          </div>
          <div className="flex-1 pt-5 flex flex-col gap-1">
            {navItems.map((item, index) => (
              <DashboardNavItem {...item} key={index} />
            ))}
          </div>
          <Link href="/">
            <Button className="w-full py-2 hover:bg-accent hover:text-background gap-2 justify-start">
              <Home size={15} />
              Back to shopping
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea maxHeight="100%" className="h-full pr-3">
          <nav className="flex-1 px-2 py-4 flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button
                  className={cn(
                    "w-full justify-start text-sm bg-transparent",
                    pathname === "/"
                      ? "bg-primary text-background"
                      : "bg-transparent"
                  )}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/flash-sales">
                <Button
                  className={cn(
                    "w-full justify-start text-sm bg-transparent",
                    pathname === "/flash-sales"
                      ? "bg-primary text-background"
                      : "bg-transparent"
                  )}
                >
                  <IoMdFlash className="mr-2 h-4 w-4" />
                  Flash sales
                </Button>
              </Link>
              <Link href="/ads">
                <Button
                  className={cn(
                    "w-full justify-start text-sm bg-transparent",
                    pathname === "/ads" || pathname.startsWith("/ads")
                      ? "bg-primary text-background"
                      : "bg-transparent"
                  )}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Ads
                </Button>
              </Link>
              <Link href="/stores">
                <Button
                  className={cn(
                    "w-full justify-start text-sm bg-transparent",
                    pathname === "/stores" || pathname.startsWith("/stores")
                      ? "bg-primary text-background"
                      : "bg-transparent"
                  )}
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  Stores
                </Button>
              </Link>
              <Link href="/map">
                <Button
                  className={cn(
                    "w-full justify-start text-sm bg-transparent",
                    pathname === "/map"
                      ? "bg-primary text-background"
                      : "bg-transparent"
                  )}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  View on map
                </Button>
              </Link>
            </div>

            <div className="">
              <Button
                className={`w-full justify-between px-2 py-1 text-sm font-medium hover:bg-secondary/50 ${
                  expandedCategories
                    ? "bg-secondary/50 rounded-b-none"
                    : "bg-transparent"
                }`}
                onClick={() => setExpandedCategories(!expandedCategories)}
              >
                <span className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Categories
                </span>
                {expandedCategories ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {expandedCategories && (
                <div className="p-3 bg-secondary/50 rounded-b-lg">
                  {categories.map((category) => (
                    <CategoryButton category={category} key={category.id} />
                  ))}
                </div>
              )}
            </div>

            <div className="">
              <Button
                className={`w-full justify-between px-2 text-sm py-1 font-medium hover:bg-secondary/50 ${
                  expandedFilters
                    ? "bg-secondary/50 rounded-b-none"
                    : "bg-transparent"
                }`}
                onClick={() => setExpandedFilters(!expandedFilters)}
              >
                <span className="flex items-center">
                  <FiFilter className="mr-2 h-4 w-4" />
                  Filters
                </span>
                {expandedFilters ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {expandedFilters && (
                <FilterCard className="bg-secondary/50 p-3 rounded-b-lg" />
              )}
            </div>
          </nav>
        </ScrollArea>
      )}
    </aside>
  );
}

const DashboardNavItem = ({
  url,
  title,
  icon,
  subNavs,
}: {
  url: string;
  title: string;
  icon: ReactNode;
  subNavs?: { url: string; title: string }[];
}) => {
  const pathname = usePathname();
  const [subNavOpen, setSubNavOpen] = useState(false);

  if (subNavs) {
    return (
      <div className="">
        <Button
          onClick={() => {
            setSubNavOpen(!subNavOpen);
          }}
          className={`w-full justify-start gap-2 py-1.5 ${
            pathname === url || pathname.startsWith(`${url} /`) || subNavOpen
              ? "bg-accent text-background"
              : "bg-transparent hover:bg-secondary hover:text-foreground"
          }`}
        >
          {icon}
          {title}
        </Button>
        {subNavOpen && (
          <div className="w-full py-2 pl-5">
            <div className="border-l">
              {subNavs.map((sb, index) => (
                <Link key={index} href={sb.url}>
                  {" "}
                  <Button
                    className={`w-full justify-start gap-2 py-1.5 rounded-none ${
                      pathname === sb.url || pathname.startsWith(`${sb.url} /`)
                        ? "bg-accent/80 text-background"
                        : "bg-transparent hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {sb.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link href={url}>
        <Button
          onClick={() => {
            setSubNavOpen(false);
          }}
          className={`w-full justify-start gap-2 py-1.5 ${
            pathname === url || pathname.startsWith(`${url} /`)
              ? "bg-accent text-background"
              : "bg-transparent hover:bg-secondary hover:text-foreground"
          }`}
        >
          {icon}
          {title}
        </Button>
      </Link>
    </div>
  );
};
