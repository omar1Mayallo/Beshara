"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/lib/api";

interface FeaturedCategoriesProps {
  categories: Category[];
}

export default function FeaturedCategories({
  categories,
}: FeaturedCategoriesProps) {
  const formatItemCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+ items`;
    }
    return `${count}+ items`;
  };

  if (!categories.length) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">No categories available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products across different categories.
            Find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <Link href={`/categories/${category.id}`}>
                  <div className="relative">
                    {/* Category Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image || "/categories/placeholder.png"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        category.color || "from-gray-500 to-gray-300"
                      } opacity-20 group-hover:opacity-30 transition-opacity`}
                    />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                      <h3 className="text-xl font-bold mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {formatItemCount(category.item_count)}
                        </span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/categories">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
