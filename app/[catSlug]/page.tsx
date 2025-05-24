import ScrollArea from "@/components/parts/layout/ScrollArea";
import AdsList from "@/components/parts/lists/AdsList";
import { categories } from "@/lib/dev_db/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function CategoryPage({ params }: { params: any }) {
  const catSlug = (await params)["catSlug"];
  const category = categories.find((cat) => cat.slug === catSlug);
  if (!category) {
    return notFound();
  }
  return (
    <div className="flex flex-col">
      {category.subCategories && category.subCategories.length > 0 && (
        <div className="p-5 pb-0">
          <h1 className="pb-2 text-base font-bold w-full flex justify-between">
            Sub-categories in {category.name}
          </h1>
          <ScrollArea>
            <div className="w-max h-fit flex gap-5">
              {category.subCategories?.map((subCategory, index) => (
                <Link
                  key={index}
                  href={`/${category.slug}/${subCategory.slug}`}
                >
                  <div className="bg-white rounded-lg p-5 w-64">
                    <h1 className="text-accent pb-1">
                      {index + 1}. {subCategory.name}
                    </h1>
                    <p className="text-xs pl-4">
                      {subCategory.adsCount ?? (Math.random() * 100).toFixed(0)}{" "}
                      ads
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      <AdsList className="" title={`Ads in ${category.name}`} />
    </div>
  );
}
