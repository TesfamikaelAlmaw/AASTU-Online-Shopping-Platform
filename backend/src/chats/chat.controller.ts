import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ReactionDto } from './dto/reaction.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  async createChat(@Req() req: any, @Body() dto: CreateChatDto) {
    return this.chatService.createOrGetChat(req.user.userId, dto);
  }

  @Get()
  async listChats(@Req() req: any) {
    return this.chatService.listChats(req.user.userId);
  }

  @Get(':chatId/messages')
  async getMessages(
    @Req() req: any,
    @Param('chatId') chatId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chatService.getMessages(
      req.user.userId,
      chatId,
      limit ? Number(limit) : 30,
      before,
    );
  }

  @Post(':chatId/messages')
  async sendMessage(@Req() req: any, @Param('chatId') chatId: string, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.userId, chatId, dto);
  }

  @Post(':chatId/read')
  async markRead(@Req() req: any, @Param('chatId') chatId: string, @Body() dto: MarkReadDto) {
    return this.chatService.markRead(req.user.userId, chatId, dto);
  }

  @Post('messages/:messageId/reaction')
  async addReaction(@Req() req: any, @Param('messageId') messageId: string, @Body() dto: ReactionDto) {
    return this.chatService.toggleReaction(req.user.userId, messageId, dto);
  }

  @Post('messages/:messageId/delete')
  async deleteMessage(@Req() req: any, @Param('messageId') messageId: string, @Body() dto: DeleteMessageDto) {
    return this.chatService.deleteMessage(req.user.userId, messageId, dto);
  }

  @Post(':chatId/favorite')
  async favorite(@Req() req: any, @Param('chatId') chatId: string, @Body() dto: FavoriteDto) {
    return this.chatService.toggleFavorite(req.user.userId, chatId, dto);
  }

  @Get(':chatId/shared')
  async sharedMedia(@Req() req: any, @Param('chatId') chatId: string) {
    return this.chatService.getSharedMedia(req.user.userId, chatId);
  }

  @Post('attachments')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    return {
      url: result.secure_url,
      type: file.mimetype || result.resource_type,
      name: file.originalname,
      size: file.size,
      width: result.width,
      height: result.height,
      duration: result.duration,
    };
  }
}
