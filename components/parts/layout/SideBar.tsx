"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Home,
  Search,
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
import FilterCard from "../cards/FiltersCard";
import { IoMdFlash } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { useAppStore } from "@/lib/store";
import { BsChatRightText, BsMegaphone } from "react-icons/bs";
import { SlBell } from "react-icons/sl";
import { PiStorefront, PiTrashSimpleLight } from "react-icons/pi";
import { Category } from "@/lib/types";
import { fetchCategories } from "@/lib/actions";

export default function Sidebar() {
  const pathname = usePathname();
  const storeId = useParams()["storeID"];
  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white font-light text-xs z-10 hidden md:block">
      {pathname.startsWith("/dashboard") ? (
        storeId ? (
          <StoreNav />
        ) : (
          <DashboardNav />
        )
      ) : (
        <DefaultNav />
      )}
    </aside>
  );
}

const DefaultNav = () => {
  const pathname = usePathname();

  const [expandedCategories, setExpandedCategories] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [fetchingCategories, startFetchingCategories] = useTransition();

  useEffect(() => {
    startFetchingCategories(async () => {
      const { data } = await fetchCategories();

      if (!data) {
        return;
      }

      setCategories(data);
    });
  }, []);

  return (
    <ScrollArea maxHeight="100%" className="h-full pr-3">
      <nav className="flex-1 px-2 py-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname === "/"
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
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
                pathname.startsWith("/flash-sales")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
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
                pathname.startsWith("/ads")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
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
                pathname.startsWith("/stores")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
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
                pathname.startsWith("/map")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
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
                : "bg-transparent hover:bg-secondary/50"
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
                <CategoryButton category={category} key={category.slug} />
              ))}
            </div>
          )}
        </div>

        <div className="">
          <Button
            className={`w-full justify-between px-2 text-sm py-1 font-medium hover:bg-secondary/50 ${
              expandedFilters
                ? "bg-secondary/50 rounded-b-none"
                : "bg-transparent hover:bg-secondary/50"
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
  );
};

const DashboardNav = () => {
  const pathname = usePathname();

  const { user } = useAppStore();
  return (
    <ScrollArea maxHeight="100%" className="h-full pr-3">
      <nav className="flex-1 px-2 py-4 flex flex-col gap-2">
        <div className="w-full py-5 flex flex-col justify-center items-center border-b border-secondary">
          <div className="h-20 w-20 bg-secondary rounded-full mb-5"></div>
          {user?.user_metadata.username && (
            <h1 className="text-xs text-accent">
              {user?.user_metadata.username}
            </h1>
          )}
          <p className="text-xs text-accent">{user?.email}</p>
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <Link href="/dashboard">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname === "/dashboard"
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <RxDashboard className="mr-2 h-4 w-4" />
              Dashbaord
            </Button>
          </Link>
          <Link href="/dashboard/stores">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/stores")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <PiStorefront className="mr-2 h-4 w-4" />
              My stores
            </Button>
          </Link>
          <Link href="/dashboard/ads">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/ads")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <BsMegaphone className="mr-2 h-4 w-4" />
              My ads
            </Button>
          </Link>
          <Link href="/dashboard/chat">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/chat")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <BsChatRightText className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </Link>
          <Link href="/dashboard/notifications">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/notifications")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <SlBell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </Link>
          <Link href="/dashboard/trash">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/trash")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <PiTrashSimpleLight className="mr-2 h-4 w-4" />
              Trash bin
            </Button>
          </Link>
        </div>
      </nav>
    </ScrollArea>
  );
};

const StoreNav = () => {
  const pathname = usePathname();
  const storeId = useParams()["storeID"];
  return (
    <ScrollArea maxHeight="100%" className="h-full pr-3">
      <nav className="flex-1 px-2 py-4 flex flex-col gap-2">
        <div className="w-full py-5 flex flex-col justify-center items-center border-b border-secondary">
          <div className="h-20 w-full bg-secondary rounded-full mb-5"></div>

          <p className="text-xs text-accent">{storeId}</p>
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <Link href="/dashboard/stores">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/stores")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <PiStorefront className="mr-2 h-4 w-4" />
              Store overview
            </Button>
          </Link>
          <Link href="/dashboard/ads">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/ads")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <BsMegaphone className="mr-2 h-4 w-4" />
              My ads
            </Button>
          </Link>
          <Link href="/dashboard/chats">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/chats")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <BsChatRightText className="mr-2 h-4 w-4" />
              Chats
            </Button>
          </Link>
          <Link href="/dashboard/notifications">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/notifications")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <SlBell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </Link>
          <Link href="/dashboard/trash">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/trash")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <PiTrashSimpleLight className="mr-2 h-4 w-4" />
              Trash bin
            </Button>
          </Link>
        </div>
      </nav>
    </ScrollArea>
  );
};
