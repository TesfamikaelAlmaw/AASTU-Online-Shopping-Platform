import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.entity';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category.name)
		private categoryModel: Model<CategoryDocument>,
	) { }

	async create(data: Partial<Category>) {
		const category = new this.categoryModel(data);
		return category.save();
	}

	async findAll() {
		return this.categoryModel.find();
	}

	async findByName(name: string) {
		return this.categoryModel.findOne({ name });
	}

	async findOne(id: string) {
		const category = await this.categoryModel.findById(id);
		if (!category) throw new NotFoundException('Category not found');
		return category;
	}

	async update(id: string, data: Partial<Category>) {
		const category = await this.categoryModel.findByIdAndUpdate(id, data, {
			new: true,
		});
		if (!category) throw new NotFoundException('Category not found');
		return category;
	}

	async remove(id: string) {
		const category = await this.categoryModel.findByIdAndDelete(id);
		if (!category) throw new NotFoundException('Category not found');
		return { message: 'Category deleted successfully' };
	}
}
