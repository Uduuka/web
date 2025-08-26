"use client";

import { ComponentProps, useEffect, useState, useTransition } from "react";
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
  Settings,
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
import { BsCashCoin, BsChatRightText, BsMegaphone } from "react-icons/bs";
import { SlBell } from "react-icons/sl";
import { PiStorefront, PiTrashSimpleLight } from "react-icons/pi";
import { Category } from "@/lib/types";
import { fetchCategories } from "@/lib/actions";
import { BiMoney } from "react-icons/bi";
import { GoListOrdered } from "react-icons/go";
import { RiFeedbackLine } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";

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

export const DefaultNav = ({ className, ...props }: ComponentProps<"nav">) => {
  const pathname = usePathname();

  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);
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
      <nav
        {...props}
        className={cn("flex-1 px-2 py-4 flex flex-col gap-2", className)}
      >
        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button
              className={cn(
                "w-full justify-start  text-inherit text-sm bg-transparent",
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
            className={`w-full justify-between px-2 py-1 text-sm ${
              expandedCategories
                ? "bg-secondary text-foreground rounded-b-none"
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
            <div className="p-3 bg-secondary text-accent rounded-b-lg">
              {categories.map((category) => (
                <CategoryButton category={category} key={category.slug} />
              ))}
            </div>
          )}
        </div>

        <div className="">
          <Button
            className={`w-full justify-between px-2 py-1 text-sm ${
              expandedFilters
                ? "bg-secondary text-foreground rounded-b-none"
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
            <FilterCard className="p-3 bg-secondary text-accent rounded-b-lg" />
          )}
        </div>
      </nav>
    </ScrollArea>
  );
};

export const DashboardNav = () => {
  const pathname = usePathname();

  const { user } = useAppStore();
  return (
    <ScrollArea maxHeight="100%" className="h-full pr-3">
      <nav className="flex-1 px-2 py-4 flex flex-col gap-2">
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
          <Link href="/dashboard/billing">
            <Button
              className={cn(
                "w-full justify-start text-sm bg-transparent",
                pathname.startsWith("/dashboard/billing")
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <BsCashCoin className="mr-2 h-4 w-4" />
              Billing
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

export const StoreNav = ({ className, ...props }: ComponentProps<"div">) => {
  const pathname = usePathname();
  const storeId = useParams()["storeID"];
  return (
    <ScrollArea maxHeight="100%" className="h-full pr-3 flex flex-col">
      <nav className="flex-1 px-2 py-4 flex flex-col gap-2">
        <div
          {...props}
          className={cn("flex flex-1 flex-col gap-2 pt-5", className)}
        >
          <Link href={`/dashboard/stores/${storeId}`}>
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
                pathname === `/dashboard/stores/${storeId}`
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <PiStorefront className="mr-2 h-4 w-4" />
              Store overview
            </Button>
          </Link>
          <Link href={`/dashboard/stores/${storeId}/ads`}>
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
                pathname.startsWith(`/dashboard/stores/${storeId}/ads`)
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <BsMegaphone className="mr-2 h-4 w-4" />
              My stock
            </Button>
          </Link>
          <Link href={`/dashboard/stores/${storeId}/pos`}>
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
                pathname.startsWith(`/dashboard/stores/${storeId}/pos`)
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <BiMoney className="mr-2 h-4 w-4" />
              Point of sales
            </Button>
          </Link>
          <Link href={`/dashboard/stores/${storeId}/orders`}>
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
                pathname.startsWith(`/dashboard/stores/${storeId}/orders`)
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <GoListOrdered className="mr-2 h-4 w-4" />
              Orders
            </Button>
          </Link>
          <Link href={`/dashboard/stores/${storeId}/reports`}>
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
                pathname.startsWith(`/dashboard/stores/${storeId}/reports`)
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <TbReportAnalytics className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href={`/dashboard/stores/${storeId}/settings`}>
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
                pathname.startsWith(`/dashboard/stores/${storeId}/settings`)
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Link href={`/dashboard/stores/${storeId}/feedback`}>
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
                pathname.startsWith(`/dashboard/stores/${storeId}/feedback`)
                  ? "bg-primary text-background"
                  : "bg-transparent hover:bg-secondary/50"
              )}
            >
              <RiFeedbackLine className="mr-2 h-4 w-4" />
              Feedback
            </Button>
          </Link>
          <Link href="/dashboard/trash">
            <Button
              className={cn(
                "w-full justify-start text-inherit text-sm bg-transparent",
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
        <div className="w-full py-5 flex flex-col justify-center items-center border-t border-secondary">
          <div className="h-20 w-full bg-secondary mb-5 rounded-lg"></div>
        </div>
      </nav>
    </ScrollArea>
  );
};
