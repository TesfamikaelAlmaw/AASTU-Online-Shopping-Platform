import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner_id: Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ enum: ['new', 'used'], default: 'used' })
  condition: 'new' | 'used';

  @Prop({ enum: ['available', 'sold', 'removed'], default: 'available' })
  status: 'available' | 'sold' | 'removed';
}

export const ItemSchema = SchemaFactory.createForClass(Item);
