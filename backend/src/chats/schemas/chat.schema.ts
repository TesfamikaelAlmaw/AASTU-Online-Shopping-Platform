import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop({ required: true, unique: true, index: true })
  participantsKey: string;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        lastReadAt: { type: Date },
      },
    ],
    default: [],
  })
  reads: { user: Types.ObjectId; lastReadAt: Date }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  favorites: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessageId: Types.ObjectId;

  @Prop()
  lastMessageText: string;

  @Prop()
  lastMessageAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.pre('validate', function (this: any) {
  if (!this.participantsKey && Array.isArray(this.participants)) {
    this.participantsKey = this.participants
      .map((id: Types.ObjectId) => id.toString())
      .sort()
      .join(':');
  }
});
