import Image from "next/image";
import Link from "next/link";
import SearchBar from "../forms/SearchBar";
import CartButton from "../buttons/CartButton";
import UserProfile from "./nav-parts/UserProfile";
import LocationButton from "./nav-parts/LocationButton";
import CurrencyButton from "./nav-parts/CurrencyButton";
import { fetchCategories, getProfile } from "@/lib/actions";
import MobileSearhBar from "./nav-parts/MobileSearhBar";

export default async function Navbar() {
  const profilePromise = getProfile();
  const categoriesPromise = fetchCategories();
  return (
    <header className="bg-primary text-background z-20 py-2 shadow-md sticky top-0 left-0">
      <div className="px-5 mx-auto w-full flex justify-between gap-5 items-center">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <Image
              src="/logos/logo-transparent.png"
              alt="Uduuka Logo"
              width={100}
              height={100}
              priority
              className="rounded-md h-12 w-12"
            />
            <div className="ml-2 h-fit text-2xl font-[900] hidden sm:block">
              <h1>DOLINE</h1>
              <p className="text-xs font-thin -mt-2 line-clamp-1">
                Shop local, trade smart...
              </p>
            </div>
          </div>
        </Link>
        <div className="hidden md:flex flex-1 justify-center items-center gap-2">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          {/* Change currency */}
          <CurrencyButton />

          {/* Location button */}
          <LocationButton />

          {/* Authentication buttons or profile */}
          <UserProfile profilePromise={profilePromise} />

          {/* Cart drop down button */}
          <CartButton />
        </div>
        {/** Mobile nav */}
        {/* <MobileNav profile={data} /> */}
      </div>
      {/* Mobile search bar that shows on non-dashboard pages. */}
      <MobileSearhBar categoriesPromise={categoriesPromise} />
    </header>
  );
}
