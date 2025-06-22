"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CategoryWithProducts, productsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/auth-context";
import { toast } from "sonner";

interface ProductCategoriesProps {
  categoriesWithProducts: CategoryWithProducts[];
}

export default function ProductCategories({
  categoriesWithProducts,
}: ProductCategoriesProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();
  const { user } = useAuth();

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const addToCart = async (productId: number) => {
    if (!user) {
      toast.warning("Please log in", {
        description: "You need to be logged in to add items to your cart.",
        closeButton: true,
      });
      router.push("/login");
      return;
    }

    setIsLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await productsApi.addToCart(productId, 1);
      toast.success("Success", {
        description: "Product added to cart!",
        style: { color: "green", background: "black" },
        closeButton: true,
      });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      // Error toast handled in apiRequest
    } finally {
      setIsLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const getImageUrl = (image: string | undefined) => {
    if (!image) return "/products/placeholder.png";
    if (!image.startsWith("http") && !image.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_API_URL}/images/products/${image}`;
    }
    return image;
  };

  if (!categoriesWithProducts.length) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">No categories available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of products organized by categories. Click on
            any category to view available products.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-4">
          {categoriesWithProducts.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-6 text-left hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  aria-expanded={expandedCategory === category.id}
                  aria-controls={`category-${category.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {category.productCount} products
                      </Badge>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-300",
                        expandedCategory === category.id && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                <div
                  id={`category-${category.id}`}
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    expandedCategory === category.id
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-6 pt-0 border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {category.products.slice(0, 8).map((product) => (
                        <Card
                          key={product.id}
                          className={cn(
                            "group overflow-hidden hover:shadow-lg transition-all duration-300",
                            !product.in_stock && "opacity-75"
                          )}
                        >
                          <CardContent className="p-0">
                            <div className="relative">
                              <div className="aspect-square overflow-hidden bg-white">
                                <img
                                  src={getImageUrl(product.images[0])}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/products/placeholder.png";
                                  }}
                                />
                              </div>

                              {product.original_price > product.price && (
                                <div className="absolute top-2 left-2">
                                  <Badge variant="destructive">
                                    -
                                    {calculateDiscount(
                                      product.original_price,
                                      product.price
                                    )}
                                    %
                                  </Badge>
                                </div>
                              )}

                              {!product.in_stock && (
                                <div className="absolute top-2 right-2">
                                  <Badge variant="secondary">
                                    Out of Stock
                                  </Badge>
                                </div>
                              )}

                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="rounded-full h-8 w-8"
                                  disabled={isLoading[product.id]}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="p-4">
                              <Link href={`/products/${product.id}`}>
                                <h4 className="font-medium text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                                  {product.name}
                                </h4>
                              </Link>

                              <div className="flex items-center gap-1 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-3 w-3",
                                        i < Math.floor(product.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  ({product.review_count})
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg font-bold text-primary">
                                  ${product.price}
                                </span>
                                {product.original_price > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    ${product.original_price}
                                  </span>
                                )}
                              </div>

                              <Button
                                size="sm"
                                className="w-full"
                                disabled={
                                  !product.in_stock || isLoading[product.id]
                                }
                                variant={
                                  product.in_stock ? "default" : "secondary"
                                }
                                onClick={() => addToCart(product.id)}
                              >
                                {product.in_stock ? (
                                  <>
                                    <ShoppingCart className="mr-2 h-3 w-3" />
                                    {isLoading[product.id]
                                      ? "Adding..."
                                      : "Add to Cart"}
                                  </>
                                ) : (
                                  "Out of Stock"
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 text-center">
                      <Button variant="outline" asChild>
                        <Link href={`/categories/${category.id}`}>
                          View All {category.name} ({category.productCount})
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
