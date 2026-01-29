import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ReactionDto } from './dto/reaction.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createOrGetChat(userId: string, dto: CreateChatDto) {
    if (userId === dto.participantId) {
      throw new BadRequestException('Cannot start a chat with yourself');
    }

    const participants = [new Types.ObjectId(userId), new Types.ObjectId(dto.participantId)];
    const participantsKey = [userId, dto.participantId].sort().join(':');

    const chat = await this.chatModel.findOneAndUpdate(
      { participantsKey },
      {
        $setOnInsert: {
          participants,
          participantsKey,
          reads: [
            { user: participants[0], lastReadAt: new Date() },
            { user: participants[1], lastReadAt: new Date(0) },
          ],
        },
      },
      { new: true, upsert: true },
    );

    return chat;
  }

  async listChats(userId: string) {
    const chats = await this.chatModel
      .find({ participants: userId })
      .populate('participants', 'full_name email department profile_image')
      .sort({ lastMessageAt: -1 });

    const deduped = new Map<string, ChatDocument>();
    chats.forEach((chat) => {
      const key = chat.participantsKey || chat.participants.map((id) => id.toString()).sort().join(':');
      const existing = deduped.get(key);
      if (!existing) {
        deduped.set(key, chat);
        return;
      }
      const existingTime = existing.lastMessageAt ? new Date(existing.lastMessageAt).getTime() : 0;
      const currentTime = chat.lastMessageAt ? new Date(chat.lastMessageAt).getTime() : 0;
      if (currentTime >= existingTime) {
        deduped.set(key, chat);
      }
    });

    const results = await Promise.all(
      Array.from(deduped.values()).map(async (chat) => {
        const unreadCount = await this.messageModel.countDocuments({
          chat: chat._id,
          sender: { $ne: userId },
          readBy: { $ne: userId },
          deletedForEveryone: { $ne: true },
          deletedFor: { $ne: userId },
        });

        const isFavorite = chat.favorites.some((fav) => fav.toString() === userId);

        return {
          ...chat.toObject(),
          unreadCount,
          isFavorite,
        };
      }),
    );

    return results;
  }

  async getMessages(userId: string, chatId: string, limit = 30, before?: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.participants.some((id) => id.toString() === userId)) {
      throw new ForbiddenException();
    }

    const query: any = {
      chat: chatId,
      deletedForEveryone: { $ne: true },
      deletedFor: { $ne: userId },
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    return this.messageModel
      .find(query)
      .populate('sender', 'full_name email profile_image')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async sendMessage(userId: string, chatId: string, dto: SendMessageDto) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.participants.some((id) => id.toString() === userId)) {
      throw new ForbiddenException();
    }

    const text = dto.text?.trim() || '';
    if (!text && (!dto.attachments || dto.attachments.length === 0)) {
      throw new BadRequestException('Message must include text or attachments');
    }

    const message = new this.messageModel({
      chat: new Types.ObjectId(chatId),
      sender: new Types.ObjectId(userId),
      text,
      attachments: dto.attachments || [],
      replyTo: dto.replyTo ? new Types.ObjectId(dto.replyTo) : undefined,
      readBy: [new Types.ObjectId(userId)],
    });

    await message.save();

    await this.chatModel.updateOne(
      { _id: chatId },
      {
        $set: {
          lastMessageId: message._id,
          lastMessageText: text || this.buildAttachmentLabel(dto.attachments || []),
          lastMessageAt: new Date(),
        },
      },
    );

    const populated = await this.messageModel
      .findById(message._id)
      .populate('sender', 'full_name email profile_image')
      .populate('replyTo');

    if (!populated) {
      throw new NotFoundException('Message not found');
    }

    return populated;
  }

  async markRead(userId: string, chatId: string, dto: MarkReadDto) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.participants.some((id) => id.toString() === userId)) {
      throw new ForbiddenException();
    }

    const now = new Date();
    const reads = chat.reads || [];
    const existing = reads.find((read) => read.user.toString() === userId);
    if (existing) {
      existing.lastReadAt = now;
    } else {
      reads.push({ user: new Types.ObjectId(userId), lastReadAt: now });
    }

    chat.reads = reads;
    await chat.save();

    const messageQuery: any = {
      chat: chatId,
      sender: { $ne: userId },
      deletedForEveryone: { $ne: true },
      deletedFor: { $ne: userId },
    };

    if (dto.messageIds && dto.messageIds.length > 0) {
      messageQuery._id = { $in: dto.messageIds };
    }

    await this.messageModel.updateMany(messageQuery, {
      $addToSet: { readBy: userId },
    });

    return { success: true };
  }

  async toggleReaction(userId: string, messageId: string, dto: ReactionDto) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    if (message.deletedForEveryone) {
      throw new BadRequestException('Message deleted');
    }

    const emoji = dto.emoji.trim();
    if (!emoji) throw new BadRequestException('Emoji is required');

    const reactions = message.reactions || [];
    const reaction = reactions.find((r) => r.emoji === emoji);

    if (!reaction) {
      reactions.push({ emoji, userIds: [new Types.ObjectId(userId)] } as any);
    } else {
      const already = reaction.userIds.some((id) => id.toString() === userId);
      if (already) {
        reaction.userIds = reaction.userIds.filter((id) => id.toString() !== userId);
      } else {
        reaction.userIds.push(new Types.ObjectId(userId));
      }
    }

    message.reactions = reactions.filter((r) => r.userIds.length > 0) as any;
    await message.save();

    const populated = await this.messageModel
      .findById(messageId)
      .populate('sender', 'full_name email profile_image')
      .populate('replyTo');

    if (!populated) {
      throw new NotFoundException('Message not found');
    }

    return populated;
  }

  async deleteMessage(userId: string, messageId: string, dto: DeleteMessageDto) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    if (dto.scope === 'everyone') {
      if (message.sender.toString() !== userId) {
        throw new ForbiddenException('Only sender can delete for everyone');
      }
      message.deletedForEveryone = true;
      await message.save();
    } else {
      await this.messageModel.updateOne(
        { _id: messageId },
        { $addToSet: { deletedFor: userId } },
      );
    }

    return { success: true, chatId: message.chat.toString() };
  }

  async toggleFavorite(userId: string, chatId: string, dto: FavoriteDto) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.participants.some((id) => id.toString() === userId)) {
      throw new ForbiddenException();
    }

    if (dto.isFavorite) {
      await this.chatModel.updateOne({ _id: chatId }, { $addToSet: { favorites: userId } });
    } else {
      await this.chatModel.updateOne({ _id: chatId }, { $pull: { favorites: userId } });
    }

    return { success: true };
  }

  async getSharedMedia(userId: string, chatId: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.participants.some((id) => id.toString() === userId)) {
      throw new ForbiddenException();
    }

    const messages = await this.messageModel
      .find({
        chat: chatId,
        deletedForEveryone: { $ne: true },
        deletedFor: { $ne: userId },
      })
      .select('attachments text createdAt sender')
      .sort({ createdAt: -1 });

    return messages;
  }

  buildAttachmentLabel(attachments: { type: string }[]) {
    if (attachments.length === 0) return '';
    const type = attachments[0].type || 'file';
    if (type.startsWith('image')) return '📷 Photo';
    if (type.startsWith('video')) return '🎥 Video';
    if (type.startsWith('audio')) return '🎵 Audio';
    return '📎 Attachment';
  }
}
