import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from './item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
  ) {}

  // Create item
  async create(data: Partial<Item>) {
    const item = new this.itemModel(data);
    return item.save();
  }

  // Get all items
  async findAll() {
    return this.itemModel.find().populate('owner_id', 'full_name email');
  }

  // Get one item
  async findById(id: string) {
    const item = await this.itemModel.findById(id).populate('owner_id');
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  // Update item
  async update(id: string, data: Partial<Item>) {
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
}
