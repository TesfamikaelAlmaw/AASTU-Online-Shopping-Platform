import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  // Create item (students only)
  @UseGuards(AuthGuard('jwt'))

  @Post("create")
  create(@Req() req, @Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto, req.user.userId);
  }

  // Get all items (public)
  @Get("all")
  findAll() {
    return this.itemsService.findAll();
  }

  // Get single item
  @Get(':id')
  findOne(@Param('id') id: string) {

    return this.itemsService.findById(id);
  }

  // Update item
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  // Delete item (admin only)
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  // Get all items for a user 
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAllByOwner(@Req() req) {
    return this.itemsService.findAllByOwner(req.user.userId);
  }
}
