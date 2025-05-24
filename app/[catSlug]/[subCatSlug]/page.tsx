import AdsList from "@/components/parts/lists/AdsList";
import { categories } from "@/lib/dev_db/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function SubCategoryPage({ params }: { params: any }) {
  const catSlug = (await params)["catSlug"];
  const subCatSlug = (await params)["subCatSlug"];

  const category = categories.find((cat) => cat.slug === catSlug);
  const subCategory = category?.subCategories?.find(
    (sc) => sc.slug === subCatSlug
  );

  if (!category) {
    return notFound();
  }
  return (
    <div className="flex flex-col">
      <h1 className="pb-2 text-base w-fit font-bold px-5 pt-5">
        <span>Ads in </span>
        <span className="font-bold text-blue-400 hover:text-blue-500 transition-colors px-5">
          <Link href={`/${category.slug}`}> {category.name} </Link>{" "}
        </span>
        {" >> "}
        <span className="pl-5">{subCategory?.name}</span>
      </h1>
      <AdsList />
    </div>
  );
}
