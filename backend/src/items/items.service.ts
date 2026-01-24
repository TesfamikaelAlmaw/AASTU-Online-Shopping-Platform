import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
  ) { }

  // Create item
  async create(createItemDto: CreateItemDto, owner_id: string) {
    const item = new this.itemModel({
      ...createItemDto,
      owner_id: new Types.ObjectId(owner_id),
    });
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
  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.itemModel.findByIdAndUpdate(id, updateItemDto, {
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
  // Get all items for a user
  async findAllByOwner(ownerId: string) {
    return this.itemModel.find({ owner_id: new Types.ObjectId(ownerId) });
  }
}
