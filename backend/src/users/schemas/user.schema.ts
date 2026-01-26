import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  department: string;

  @Prop({ default: 'student' })
  role: 'student' | 'admin';

  @Prop({ default: 'active' })
  status: 'active' | 'suspended';

  @Prop()
  profile_image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
