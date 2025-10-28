"use client";

import { BiError } from "react-icons/bi";

export default function ErrorPage() {
  return (
    <div className="p-5 pt-20">
      <div className="p-5 w-full text-center bg-gray-50 text-gray-500 rounded-lg max-w-sm mx-auto">
        <BiError size={40} className="mx-auto" />
        <p className="text-xl font-ligth">
          Oops! an error occured while loading your page. Please try again or
          contact support
        </p>
      </div>
    </div>
  );
}
