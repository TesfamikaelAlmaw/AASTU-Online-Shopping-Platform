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

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, default: "other" })
  category: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ enum: ['new', 'used'], default: 'used' })
  condition: 'new' | 'used';

  @Prop({ enum: ['available', 'sold', 'removed'], default: 'available' })
  status: 'available' | 'sold' | 'removed';

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: { user: Types.ObjectId; text: string; createdAt: Date }[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
