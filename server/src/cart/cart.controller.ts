import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(
    @CurrentUser() user: User,
    @Body()
    body: {
      productId: number;
      quantity: number;
      selectedColor?: string;
      selectedSize?: string;
    },
  ) {
    return this.cartService.addToCart(
      user.id,
      body.productId,
      body.quantity,
      body.selectedColor,
      body.selectedSize,
    );
  }

  @Get()
  async getUserCart(@CurrentUser() user: User) {
    return this.cartService.getUserCart(user.id);
  }
}
