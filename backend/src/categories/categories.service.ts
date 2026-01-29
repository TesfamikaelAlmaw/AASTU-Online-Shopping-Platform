import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
	constructor(
		@InjectModel(Category.name)
		private categoryModel: Model<CategoryDocument>,
	) { }

	private readonly logger = new Logger(CategoriesService.name);

	private readonly defaultCategories: Array<Partial<Category>> = [
		{ name: 'Book', description: 'Textbooks, reference books, and reading materials.' },
		{ name: 'Electronics', description: 'Laptops, phones, accessories, and gadgets.' },
		{ name: 'Clothes', description: 'Apparel, shoes, and fashion items.' },
		{ name: 'Furniture', description: 'Tables, chairs, shelves, and dorm essentials.' },
		{ name: 'Gaming', description: 'Consoles, games, and gaming accessories.' },
		{ name: 'Audio', description: 'Headphones, speakers, and audio devices.' },
	];

	async onModuleInit() {
		const count = await this.categoryModel.countDocuments();
		if (count === 0) {
			await this.categoryModel.insertMany(this.defaultCategories);
			this.logger.log('Seeded default categories');
		}
	}

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
