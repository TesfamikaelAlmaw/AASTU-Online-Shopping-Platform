import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './report.entity.js';

@Injectable()
export class ReportsService {
	constructor(
		@InjectModel(Report.name)
		private reportModel: Model<ReportDocument>,
	) { }

	async create(reporterId: string, data: any) {
		const report = new this.reportModel({
			...data,
			reporter: reporterId,
		});
		return report.save();
	}

	async findAll() {
		return this.reportModel
			.find()
			.populate('reporter', 'full_name email')
			.populate({
				path: 'reported_item',
				select: 'title price owner_id',
				populate: {
					path: 'owner_id',
					select: 'full_name',
				},
			})
			.exec();
	}

	async findOne(id: string) {
		const report = await this.reportModel
			.findById(id)
			.populate('reporter', 'full_name email')
			.populate('reported_item')
			.exec();
		if (!report) throw new NotFoundException('Report not found');
		return report;
	}

	async update(id: string, data: Partial<Report>) {
		const report = await this.reportModel.findByIdAndUpdate(id, data, {
			new: true,
		});
		if (!report) throw new NotFoundException('Report not found');
		return report;
	}

	async remove(id: string) {
		const report = await this.reportModel.findByIdAndDelete(id).exec();
		if (!report) throw new NotFoundException('Report not found');
		return { message: 'Report deleted successfully' };
	}
}
