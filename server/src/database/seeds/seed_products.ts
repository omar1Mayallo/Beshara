import { Knex } from 'knex';

type Product = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  brand: string;
  sku: string;
  images: string;
  features: string;
  specifications: string;
  colors: string;
  sizes: string;
  badge: string;
  badge_variant: string;
};

export async function seed(knex: Knex): Promise<void> {
  // Clean up existing data
  await knex('products').del();
  await knex('categories').del();

  // Insert categories
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets & tech',
      image: 'https://placehold.co/300x200?text=Electronics',
      item_count: 25,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Trendy clothes & accessories',
      image: 'https://placehold.co/300x200?text=Fashion',
      item_count: 25,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 3,
      name: 'Home & Kitchen',
      description: 'Everything for your home',
      image: 'https://placehold.co/300x200?text=Home+Kitchen',
      item_count: 25,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      name: 'Sports & Outdoors',
      description: 'Fitness & outdoor gear',
      image: 'https://placehold.co/300x200?text=Sports+Outdoors',
      item_count: 25,
      color: 'from-orange-500 to-red-500',
    },
  ];

  await knex('categories').insert(categories);

  // Insert products
  const products: Product[] = [];
  const brands = {
    1: ['Apple', 'Samsung', 'Sony', 'Bose', 'LG'],
    2: ['Nike', 'Adidas', "Levi's", 'Zara', 'H&M'],
    3: ['IKEA', 'KitchenAid', 'Dyson', 'Philips', 'OXO'],
    4: ['Nike', 'Adidas', 'The North Face', 'Patagonia', 'Yeti'],
  };
  const badgeVariants = ['default', 'secondary', 'destructive', 'outline'];
  const badges = ['Best Seller', 'New', 'Sale', 'Popular', 'Limited'];

  for (let i = 1; i <= 100; i++) {
    const categoryId = (i % 4) + 1; // Distribute products evenly across 4 categories
    const brandList = brands[categoryId as keyof typeof brands];
    const brand = brandList[Math.floor(Math.random() * brandList.length)];
    const price = +(Math.random() * 500 + 20).toFixed(2);
    const originalPrice = +(price + Math.random() * 100).toFixed(2);
    const rating = +(Math.random() * 2 + 3).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 500);
    const stockQuantity = Math.floor(Math.random() * 50);
    const badge = badges[Math.floor(Math.random() * badges.length)];
    const badgeVariant =
      badgeVariants[Math.floor(Math.random() * badgeVariants.length)];

    products.push({
      id: i,
      category_id: categoryId,
      name: `${brand} ${getProductName(categoryId, i)}`,
      description: getProductDescription(categoryId, brand, i),
      price,
      original_price: originalPrice,
      rating,
      review_count: reviewCount,
      in_stock: stockQuantity > 0,
      stock_quantity: stockQuantity,
      brand: brand,
      sku: `SKU-${categoryId}-${i.toString().padStart(3, '0')}`,
      images: JSON.stringify([
        `https://placehold.co/600x400?text=${encodeURIComponent(brand)}+${encodeURIComponent(getProductName(categoryId, i))}`,
      ]),
      features: JSON.stringify(getFeatures(categoryId, i)),
      specifications: JSON.stringify(getSpecifications(categoryId, i)),
      colors: JSON.stringify(getColors(categoryId)),
      sizes: JSON.stringify(getSizes(categoryId)),
      badge,
      badge_variant: badgeVariant,
    });
  }

  await knex('products').insert(products);

  // Update category item_counts after inserting products
  const updatedCounts = await knex('products')
    .select('category_id')
    .count('* as count')
    .groupBy('category_id');

  for (const { category_id, count } of updatedCounts) {
    await knex('categories')
      .where('id', category_id)
      .update({ item_count: Number(count) });
  }
}

// Helper functions for product generation
function getProductName(categoryId: number, productId: number): string {
  const names = {
    1: [
      'Smartphone Pro',
      'Wireless Headphones',
      '4K Smart TV',
      'Laptop Ultra',
      'Smart Watch',
    ],
    2: ['T-Shirt', 'Jeans', 'Running Shoes', 'Winter Jacket', 'Dress'],
    3: ['Coffee Maker', 'Air Fryer', 'Vacuum Cleaner', 'Blender', 'Dining Set'],
    4: [
      'Running Shoes',
      'Camping Tent',
      'Yoga Mat',
      'Water Bottle',
      'Backpack',
    ],
  };
  return names[categoryId as keyof typeof names][productId % 5];
}

function getProductDescription(
  categoryId: number,
  brand: string,
  productId: number,
): string {
  const descriptors = {
    1: `Premium ${brand} device with cutting-edge technology. Model ${productId} features advanced performance and sleek design.`,
    2: `Stylish ${brand} apparel that combines comfort and fashion. Perfect for any occasion.`,
    3: `${brand}'s innovative home solution that makes your life easier. Designed for durability and performance.`,
    4: `High-performance ${brand} gear for your active lifestyle. Built to last in any condition.`,
  };
  return descriptors[categoryId as keyof typeof descriptors];
}

function getFeatures(categoryId: number, productId: number): string[] {
  const commonFeatures = [
    'High quality materials',
    'Durable construction',
    'Easy to use',
    '1-year warranty',
  ];

  const categoryFeatures = {
    1: [
      'Advanced processor',
      'High-resolution display',
      'Long battery life',
      'Latest operating system',
    ],
    2: [
      'Breathable fabric',
      'Multiple color options',
      'Comfort fit',
      'Machine washable',
    ],
    3: [
      'Energy efficient',
      'Easy to clean',
      'Space saving design',
      'Quiet operation',
    ],
    4: [
      'Weather resistant',
      'Lightweight',
      'Ergonomic design',
      'Multi-purpose use',
    ],
  };

  return [
    ...commonFeatures,
    ...categoryFeatures[categoryId as keyof typeof categoryFeatures],
  ];
}

function getSpecifications(
  categoryId: number,
  productId: number,
): Record<string, string> {
  const baseSpecs = {
    Weight: `${(Math.random() * 5 + 0.5).toFixed(1)} kg`,
    Dimensions: 'Various sizes available',
  };

  const categorySpecs = {
    1: {
      Processor: 'Octa-core',
      Storage: `${64 + (productId % 5) * 64}GB`,
      'Screen Size': `${5 + (productId % 3)} inch`,
    },
    2: {
      Material: '100% Cotton',
      Size: ['S', 'M', 'L', 'XL'][productId % 4],
      Color: 'Various',
    },
    3: {
      Power: `${800 + (productId % 10) * 100}W`,
      Capacity: `${1 + (productId % 4)}L`,
      Color: 'Stainless Steel',
    },
    4: {
      Material: 'Nylon/Polyester',
      Capacity: `${20 + (productId % 10)}L`,
      Waterproof: 'Yes',
    },
  };

  return {
    ...baseSpecs,
    ...categorySpecs[categoryId as keyof typeof categorySpecs],
  };
}

function getColors(
  categoryId: number,
): Array<{ name: string; value: string; available: boolean }> {
  const colorOptions = [
    { name: 'Black', value: '#000000', available: true },
    { name: 'White', value: '#FFFFFF', available: Math.random() > 0.3 },
    { name: 'Blue', value: '#0000FF', available: Math.random() > 0.5 },
    { name: 'Red', value: '#FF0000', available: Math.random() > 0.5 },
  ];

  // Electronics typically have fewer color options
  if (categoryId === 1) {
    return [colorOptions[0], colorOptions[1]];
  }

  return colorOptions;
}

function getSizes(categoryId: number): string[] {
  if (categoryId === 2) {
    // Fashion
    return ['XS', 'S', 'M', 'L', 'XL'];
  } else if (categoryId === 4) {
    // Sports
    return ['One Size', 'S/M', 'L/XL'];
  }
  return ['One Size'];
}
