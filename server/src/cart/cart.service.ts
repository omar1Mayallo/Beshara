import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';

@Injectable()
export class CartService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ) {
    // Validate product exists and is in stock
    const product = await this.knex('products').where('id', productId).first();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (!product.in_stock || product.stock_quantity < quantity) {
      throw new BadRequestException(
        `Product with ID ${productId} is out of stock or insufficient quantity`,
      );
    }

    // Validate color and size if provided
    if (selectedColor) {
      const colors = product.colors as Array<{
        name: string;
        value: string;
        available: boolean;
      }>;
      if (!colors.some((c) => c.name === selectedColor && c.available)) {
        throw new BadRequestException(
          `Invalid or unavailable color: ${selectedColor}`,
        );
      }
    }
    if (selectedSize) {
      const sizes = product.sizes as string[];
      if (!sizes.includes(selectedSize)) {
        throw new BadRequestException(`Invalid size: ${selectedSize}`);
      }
    }

    // Check if item already in cart
    const existingCartItem = await this.knex('carts')
      .where({
        user_id: userId,
        product_id: productId,
        selected_color: selectedColor || null,
        selected_size: selectedSize || null,
      })
      .first();

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        throw new BadRequestException(
          `Cannot add ${quantity} more. Only ${product.stock_quantity} available`,
        );
      }
      return this.knex('carts')
        .where('id', existingCartItem.id)
        .update({
          quantity: newQuantity,
          updated_at: this.knex.fn.now(),
        })
        .returning('*')
        .then((rows) => rows[0]);
    }

    // Insert new cart item
    return this.knex('carts')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
        selected_color: selectedColor,
        selected_size: selectedSize,
        created_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      })
      .returning('*')
      .then((rows) => rows[0]);
  }

  async getUserCart(userId: number) {
    return this.knex('carts')
      .select(
        'carts.*',
        'products.*',
        'categories.name as category',
        this.knex.raw('products.id as product_id'),
      )
      .join('products', 'carts.product_id', 'products.id')
      .join('categories', 'products.category_id', 'categories.id')
      .where('carts.user_id', userId);
  }
}
