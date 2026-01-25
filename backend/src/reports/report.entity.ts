import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	reporter: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: 'Item', required: true })
	reported_item: Types.ObjectId;

	@Prop({ required: true })
	reason: string;

	@Prop({
		enum: ['pending', 'resolved', 'dismissed'],
		default: 'pending',
	})
	status: 'pending' | 'resolved' | 'dismissed';

	@Prop()
	admin_notes: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
