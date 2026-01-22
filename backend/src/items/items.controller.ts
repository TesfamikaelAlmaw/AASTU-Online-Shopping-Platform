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

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // Create item (students only)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req, @Body() body) {
    return this.itemsService.create({
      ...body,
      owner_id: req.user.userId,
    });
  }

  // Get all items (public)
  @Get()
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
  update(@Param('id') id: string, @Body() body) {
    return this.itemsService.update(id, body);
  }

  // Delete item (admin only)
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
