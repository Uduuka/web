import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { Category } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function CategoryButton({ category }: { category: Category }) {
  return (
    <Popup
      trigger={
        <Button className="bg-transparent group-focus-within:bg-gray-300 hover:bg-gray-300 w-full py-1 rounded justify-between ">
          <span>{category.name}</span>
          <span className="text-xs text-muted-foreground">
            {category.adsCount}
          </span>
        </Button>
      }
      className="group"
      align="vertical"
      contentStyle="w-full bg-gray-300 mt-2 sm:mt-1 shadow-2xl"
    >
      <div className="text-xs">
        {category.sub_categories?.map((subCategory) => (
          <Link
            key={subCategory.slug}
            href={`/${category.slug}/${subCategory.slug}`}
            className="w-full"
          >
            <Button className="bg-transparent hover:bg-white w-full py-1 rounded justify-between">
              <span className="text-left line-clamp-1">{subCategory.name}</span>
              <span className="text-xs">{subCategory.adsCount}</span>
            </Button>
          </Link>
        ))}
        <Link href={`/${category.slug}`}>
          <Button className="bg-transparent hover:bg-white w-full py-1 rounded justify-start">
            View all in {category.name}
          </Button>
        </Link>
      </div>
    </Popup>
  );
}
