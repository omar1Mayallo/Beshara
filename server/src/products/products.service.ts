import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'src/database/database.provider';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async getAllCategories() {
    return this.knex('categories').select('*').orderBy('name');
  }

  async getFeaturedProducts() {
    return this.knex('products')
      .select('products.*', 'categories.name as category')
      .join('categories', 'products.category_id', 'categories.id')
      .whereNotNull('badge')
      .where('in_stock', true)
      .orderBy('rating', 'desc')
      .limit(6);
  }

  async getProductById(id: number) {
    const product = await this.knex('products')
      .select('products.*', 'categories.name as category')
      .join('categories', 'products.category_id', 'categories.id')
      .where('products.id', id)
      .first();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async getProductsByCategory(categoryId: number) {
    const category = await this.knex('categories')
      .where('id', categoryId)
      .first();
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      productCount: category.item_count,
      products: await this.knex('products')
        .select('products.*', 'categories.name as category')
        .join('categories', 'products.category_id', 'categories.id')
        .where('products.category_id', categoryId)
        .orderBy('rating', 'desc'),
    };
  }
}
