import { notFound } from "next/navigation";
import { productsApi, Product } from "@/lib/api";
import ProductDetails from "./sections/product-details";

interface ProductPageProps {
  params: Promise<{ id: string }>; // Type params as Promise for Next.js 14+
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product | null = null;

  try {
    const resolvedParams = await params; // Await params to resolve the Promise

    const productId = parseInt(resolvedParams.id, 10);
    if (isNaN(productId)) {
      throw new Error("Invalid product ID");
    }
    product = await productsApi.getProductById(productId);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound(); // Redirect to 404 page if product fetch fails
  }

  return <ProductDetails product={product} />;
}
