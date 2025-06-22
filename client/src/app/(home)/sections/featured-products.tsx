"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Product, productsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/auth-context";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();
  const { user } = useAuth();

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

  if (!products.length) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">No featured products available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products with amazing
            deals and customer favorites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-square overflow-hidden bg-white">
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/products/placeholder.png";
                      }}
                    />
                  </div>

                  {product.badge && (
                    <div className="absolute top-3 left-3">
                      <Badge variant={product.badge_variant || "default"}>
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  {product.original_price > product.price && (
                    <div className="absolute top-3 right-3">
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

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      disabled={isLoading[product.id]}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.review_count})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    {product.original_price > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.original_price}
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => addToCart(product.id)}
                    disabled={isLoading[product.id] || !product.in_stock}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isLoading[product.id] ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
