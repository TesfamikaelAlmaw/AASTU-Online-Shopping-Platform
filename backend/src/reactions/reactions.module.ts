import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { Item, ItemSchema } from '../items/item.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
	],
	controllers: [ReactionsController],
	providers: [ReactionsService],
})
export class ReactionsModule { }
