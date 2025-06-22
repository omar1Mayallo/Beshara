import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('categories')
  async getAllCategories() {
    return this.productsService.getAllCategories();
  }

  @Get('featured')
  async getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProductById(id);
  }

  @Get('categories/:categoryId/products')
  async getProductsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.getProductsByCategory(categoryId);
  }
}
