import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from './item.entity';

import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
    private categoriesService: CategoriesService,
  ) { }

  // Helper to resolve category ID from name or ID
  private async _resolveCategory(category: any): Promise<Types.ObjectId | null> {
    if (!category) return null;

    // If it's already a valid ObjectId string or object, return it
    if (Types.ObjectId.isValid(category)) {
      return new Types.ObjectId(category.toString());
    }

    // If it's a name string, resolve it
    if (typeof category === 'string') {
      let resolved = await this.categoriesService.findByName(category);
      if (!resolved) {
        resolved = await this.categoriesService.create({ name: category });
      }
      return resolved._id as Types.ObjectId;
    }

    return null;
  }

  // Create item
  async create(data: any) {
    if (data.category) {
      data.category = await this._resolveCategory(data.category);
    }
    const item = new this.itemModel(data);
    return item.save();
  }

  // Get all items
  async findAll() {
    return this.itemModel
      .find()
      .populate('owner_id', 'full_name email department')
      .populate('category');
  }

  // Get one item
  async findById(id: string) {
    // Basic ID validation before querying to avoid CastError here too
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid Item ID');
    }

    const item = await this.itemModel
      .findById(id)
      .populate('owner_id', 'full_name department')
      .populate('category')
      .populate('comments.user', 'full_name');
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  // Update item
  async update(id: string, data: any) {
    if (data.category) {
      data.category = await this._resolveCategory(data.category);
    }
    const item = await this.itemModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  // Delete item
  async remove(id: string) {
    const item = await this.itemModel.findByIdAndDelete(id);
    if (!item) throw new NotFoundException('Item not found');
    return { message: 'Item deleted successfully' };
  }

  // Toggle Like
  async toggleLike(id: string, userId: string) {
    const item = await this.findById(id);
    const index = item.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      item.likes.push(new Types.ObjectId(userId));
    } else {
      item.likes.splice(index, 1);
    }

    await item.save();
    return this.findById(id);
  }

  // Add Comment
  async addComment(id: string, userId: string, text: string) {
    const item = await this.findById(id);
    item.comments.push({
      user: new Types.ObjectId(userId),
      text,
      createdAt: new Date(),
    });
    await item.save();
    return this.findById(id);
  }

  // Delete Comment
  async deleteComment(id: string, commentId: string, userId: string) {
    const item = await this.findById(id);
    const commentIndex = item.comments.findIndex(
      (c: any) => c._id.toString() === commentId
    );

    if (commentIndex === -1) throw new NotFoundException('Comment not found');

    const comment = item.comments[commentIndex];
    if (comment.user['_id'].toString() !== userId) {
      throw new Error('Not authorized to delete this comment');
    }

    item.comments.splice(commentIndex, 1);
    await item.save();
    return this.findById(id);
  }
}
