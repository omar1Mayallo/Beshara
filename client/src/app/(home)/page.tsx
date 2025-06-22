import FeaturedCategories from "./sections/featured-categories";
import FeaturedProducts from "./sections/featured-products";
import HeroSection from "./sections/hero-section";
import ProductCategories from "./sections/product-categories";
import {
  Category,
  CategoryWithProducts,
  Product,
  productsApi,
} from "@/lib/api";

export default async function HomePage() {
  let categories: Category[] = [];
  let featuredProducts: Product[] = [];
  let categoriesWithProducts: CategoryWithProducts[] = [];

  try {
    categories = await productsApi.getCategories();
    featuredProducts = await productsApi.getFeaturedProducts();
    categoriesWithProducts = await Promise.all(
      categories.map((category) =>
        productsApi.getProductsByCategory(category.id)
      )
    );
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  return (
    <>
      <HeroSection />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <ProductCategories categoriesWithProducts={categoriesWithProducts} />
    </>
  );
}
