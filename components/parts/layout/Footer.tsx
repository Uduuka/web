import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-background p-6 shadow-sm">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Company Info */}
        <div className="text-center sm:text-left">
          <h3 className="text-base font-bold">Uduuka</h3>
          <p className="text-sm">Shop Local, Trade Smart</p>
          <p className="text-sm">© 2025 Uduuka. All rights reserved.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="text-sm hover:text-uduuka-blue">
            Home
          </Link>
          <Link href="/listings" className="text-sm hover:text-uduuka-blue">
            Listings
          </Link>
          <Link href="/signin" className="text-sm hover:text-uduuka-blue">
            Sign In
          </Link>
        </div>

        {/* Social and Contact */}
        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="flex gap-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="text-sm hover:text-uduuka-blue"
            >
              Facebook
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-sm hover:text-uduuka-blue"
            >
              Instagram
            </Link>
          </div>
          <p className="text-sm">
            Contact:{" "}
            <Link
              href="mailto:info@uduuka.com"
              className="hover:text-uduuka-blue"
            >
              info@uduuka.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
