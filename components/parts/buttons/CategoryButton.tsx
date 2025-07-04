import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { Category } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function CategoryButton({ category }: { category: Category }) {
  return (
    <Popup
      trigger={
        <Button className="bg-transparent group-focus-within:bg-secondary hover:bg-secondary w-full py-1 rounded justify-between ">
          <span>{category.name}</span>
          <span className="text-xs text-muted-foreground">
            {category.adsCount}
          </span>
        </Button>
      }
      className="group"
      align="vertical"
      contentStyle="w-full bg-secondary"
    >
      <div className="text-xs">
        {category.sub_categories?.map((subCategory) => (
          <Link
            key={subCategory.slug}
            href={`/${category.slug}/${subCategory.slug}`}
          >
            <Button className="bg-transparent hover:bg-white w-full py-1 rounded justify-between">
              <span>{subCategory.name}</span>
              <span className="text-xs text-muted-foreground">
                {subCategory.adsCount}
              </span>
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
