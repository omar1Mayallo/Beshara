import { CartModule } from './cart/cart.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
  ],
})
export class AppModule {}
