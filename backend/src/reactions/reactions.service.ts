import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from '../items/item.entity';

@Injectable()
export class ReactionsService {
	constructor(
		@InjectModel(Item.name)
		private itemModel: Model<ItemDocument>,
	) { }

	private async _findItem(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException('Invalid Item ID');
		}
		const item = await this.itemModel.findById(id);
		if (!item) throw new NotFoundException('Item not found');
		return item;
	}

	private async _populateItem(id: string) {
		return this.itemModel
			.findById(id)
			.populate('owner_id', 'full_name department profile_image')
			.populate('category')
			.populate('comments.user', 'full_name profile_image');
	}

	async toggleLike(itemId: string, userId: string) {
		const item = await this._findItem(itemId);
		const index = item.likes.findIndex((id) => id.toString() === userId);

		if (index === -1) {
			item.likes.push(new Types.ObjectId(userId));
		} else {
			item.likes.splice(index, 1);
		}

		await item.save();
		return this._populateItem(itemId);
	}

	async addComment(itemId: string, userId: string, text: string) {
		const item = await this._findItem(itemId);
		item.comments.push({
			user: new Types.ObjectId(userId),
			text,
			createdAt: new Date(),
		});
		await item.save();
		return this._populateItem(itemId);
	}

	async deleteComment(itemId: string, commentId: string, userId: string) {
		const item = await this._findItem(itemId);
		const commentIndex = item.comments.findIndex(
			(c: any) => c._id.toString() === commentId
		);

		if (commentIndex === -1) throw new NotFoundException('Comment not found');

		const comment = item.comments[commentIndex];
		const commUserId = comment.user['_id']?.toString() || comment.user.toString();

		if (commUserId !== userId) {
			throw new Error('Not authorized to delete this comment');
		}

		item.comments.splice(commentIndex, 1);
		await item.save();
		return this._populateItem(itemId);
	}
}
