import ScrollArea from "@/components/parts/layout/ScrollArea";
import AdsList from "@/components/parts/lists/AdsList";
import { fetchAds, fetchCategories } from "@/lib/actions";
import { Category } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ catSlug: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { catSlug } = await params;
  const { search } = await searchParams;
  const { data } = await fetchCategories({ catSlug });
  const category = (data as Category[])[0];

  const fetchPromise = fetchAds({ category: catSlug, search });

  if (!category) {
    return notFound();
  }

  return (
    <div className="flex flex-col">
      {category.sub_categories && category.sub_categories.length > 0 && (
        <div className="p-5 pb-0">
          <h1 className="pb-2 text-base font-bold w-full flex justify-between">
            Sub-categories in {category.name}
          </h1>
          <ScrollArea>
            <div className="w-max h-fit flex gap-5">
              {category.sub_categories?.map((subCategory, index) => (
                <Link
                  key={index}
                  href={`/${category.slug}/${subCategory.slug}`}
                >
                  <div className="bg-white text-xs py-2 text-gray-500 rounded-lg px-5 w-fit">
                    <h1 className="text-accent">
                      {index + 1}. {subCategory.name}
                    </h1>
                    <p className="text-xs text-right text-gray-400">
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
      <AdsList fetchPromise={fetchPromise} />
    </div>
  );
}
