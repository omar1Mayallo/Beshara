"use client";

import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Dummy related products
const relatedProducts = [
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.6,
    reviews: 89,
    image: "/products/bag.png?height=250&width=250",
    inStock: true,
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.4,
    reviews: 156,
    image: "/products/glass.png?height=250&width=250",
    inStock: true,
  },
  {
    id: 4,
    name: "USB-C Charging Cable",
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviews: 234,
    image: "/products/shoes.png?height=250&width=250",
    inStock: true,
  },
  {
    id: 5,
    name: "Phone Stand",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviews: 67,
    image: "/products/shirt.png?height=250&width=250",
    inStock: false,
  },
];

interface RelatedProductsProps {
  currentProductId: number;
  category: string;
}

export default function RelatedProducts({
  currentProductId,
  category,
}: RelatedProductsProps) {
  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">Related Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="relative">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-white">
                  <img
                    src={product.image || "/products/bag.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Discount Badge */}
                {product.originalPrice > product.price && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive">
                      -{calculateDiscount(product.originalPrice, product.price)}
                      %
                    </Badge>
                  </div>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">Out of Stock</Badge>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-medium text-sm mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
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
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!product.inStock}
                  variant={product.inStock ? "default" : "secondary"}
                >
                  {product.inStock ? (
                    <>
                      <ShoppingCart className="mr-2 h-3 w-3" />
                      Add to Cart
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
    </section>
  );
}
