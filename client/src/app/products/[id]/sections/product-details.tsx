"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Product, productsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/auth-context";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.find((c) => c.available)?.name || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes[0] || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const addToCart = async () => {
    if (!user) {
      toast.warning("Please log in", {
        description: "You need to be logged in to add items to your cart.",
        closeButton: true,
      });
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      await productsApi.addToCart(
        product.id,
        1,
        selectedColor || undefined,
        selectedSize || undefined
      );
      toast.success("Success", {
        description: `${product.name} added to cart!`,
        style: { color: "green", background: "black" },
        closeButton: true,
      });
    } catch (error: any) {
      // Error toast handled in apiRequest
    } finally {
      setIsLoading(false);
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

  const imageUrl = getImageUrl(product.images[0]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/products/placeholder.png";
                    }}
                  />
                </div>
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant={product.badge_variant || "default"}>
                      {product.badge}
                    </Badge>
                  </div>
                )}
                {product.original_price > product.price && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive">
                      -
                      {calculateDiscount(product.original_price, product.price)}
                      %
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.review_count} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                ${product.price}
              </span>
              {product.original_price > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.original_price}
                </span>
              )}
            </div>

            <div className="mb-6">
              <Badge variant={product.in_stock ? "default" : "destructive"}>
                {product.in_stock
                  ? `In Stock (${product.stock_quantity} available)`
                  : "Out of Stock"}
              </Badge>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color.name}
                      variant={
                        selectedColor === color.name ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        color.available && setSelectedColor(color.name)
                      }
                      disabled={!color.available}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <Button
                size="lg"
                disabled={!product.in_stock || isLoading}
                className="flex-1"
                onClick={addToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline" disabled={isLoading}>
                <Heart className={`h-5 w-5`} />
              </Button>
            </div>

            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="features" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="list-disc pl-5 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specifications" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="space-y-2">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="font-semibold">{key}</dt>
                            <dd className="text-muted-foreground">{value}</dd>
                          </div>
                        )
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p>
                        <span className="font-semibold">Brand:</span>{" "}
                        {product.brand}
                      </p>
                      <p>
                        <span className="font-semibold">SKU:</span>{" "}
                        {product.sku}
                      </p>
                      <p>
                        <span className="font-semibold">Category:</span>{" "}
                        {product.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
