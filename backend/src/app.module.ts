import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { ReportsModule } from './reports/reports.module';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/aastu_shop'),
    AuthModule,
    UsersModule,
    ItemsModule,
    CategoriesModule,
    ReportsModule

  ],
})
export class AppModule { }
