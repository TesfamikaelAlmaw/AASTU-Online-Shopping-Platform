import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { ReportsModule } from './reports/reports.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ChatModule } from './chats/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule,
    UsersModule,
    ItemsModule,
    CategoriesModule,
    ReportsModule,
    ReactionsModule,
    ChatModule
  ],
})
export class AppModule { }
