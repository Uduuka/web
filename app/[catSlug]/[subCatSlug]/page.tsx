import AdsList from "@/components/parts/lists/AdsList";
import { fetchCategories } from "@/lib/actions";
import { SubCategory } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function SubCategoryPage({ params }: { params: any }) {
  const subCatSlug = (await params)["subCatSlug"];

  const subCategory = (
    (await fetchCategories({ subCateSlug: subCatSlug })).data as SubCategory[]
  )[0];

  if (!subCategory) {
    return notFound();
  }
  const category = subCategory.category;
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
