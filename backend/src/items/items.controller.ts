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
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  // Create item (students only)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Req() req, @Body() body, @UploadedFile() file: Express.Multer.File) {
    let imageUrls: string[] = [];
    if (file) {
      const upload = await this.cloudinaryService.uploadFile(file);
      imageUrls.push(upload.secure_url);
    }

    return this.itemsService.create({
      ...body,
      owner_id: req.user.userId,
      images: imageUrls,
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

  // Update item (Owner or Admin)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() body) {
    const item = await this.itemsService.findById(id);
    const ownerId = item.owner_id['_id']?.toString() || item.owner_id.toString();

    if (req.user.role !== 'admin' && ownerId !== req.user.userId) {
      throw new ForbiddenException('You are not authorized to update this item');
    }
    return this.itemsService.update(id, body);
  }

  // Delete item (Owner or Admin)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const item = await this.itemsService.findById(id);
    const ownerId = item.owner_id['_id']?.toString() || item.owner_id.toString();

    if (req.user.role !== 'admin' && ownerId !== req.user.userId) {
      throw new ForbiddenException('You are not authorized to delete this item');
    }
    return this.itemsService.remove(id);
  }

  // Like Toggle
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  async toggleLike(@Req() req, @Param('id') id: string) {
    return this.itemsService.toggleLike(id, req.user.userId);
  }

  // Add Comment
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comment')
  async addComment(@Req() req, @Param('id') id: string, @Body('text') text: string) {
    return this.itemsService.addComment(id, req.user.userId, text);
  }

  // Delete Comment
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/comment/:commentId')
  async deleteComment(
    @Req() req,
    @Param('id') id: string,
    @Param('commentId') commentId: string
  ) {
    return this.itemsService.deleteComment(id, commentId, req.user.userId);
  }
}
