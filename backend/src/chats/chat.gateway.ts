import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, number>();

  constructor(private jwtService: JwtService, private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload: any = this.jwtService.verify(token, { secret: 'JWT_SECRET_KEY' });
      client.data.userId = payload.sub;
      const count = this.onlineUsers.get(payload.sub) || 0;
      this.onlineUsers.set(payload.sub, count + 1);
      this.server.emit('presence', { userId: payload.sub, status: 'online' });
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId as string;
    if (!userId) return;
    const count = this.onlineUsers.get(userId) || 0;
    if (count <= 1) {
      this.onlineUsers.delete(userId);
      this.server.emit('presence', { userId, status: 'offline' });
    } else {
      this.onlineUsers.set(userId, count - 1);
    }
  }

  @SubscribeMessage('joinChat')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    client.join(data.chatId);
    return { joined: data.chatId };
  }

  @SubscribeMessage('leaveChat')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string }) {
    client.leave(data.chatId);
    return { left: data.chatId };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; isTyping: boolean },
  ) {
    const userId = client.data.userId as string;
    client.to(data.chatId).emit('typing', { chatId: data.chatId, userId, isTyping: data.isTyping });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; text?: string; attachments?: any[]; replyTo?: string },
  ) {
    const userId = client.data.userId as string;
    const message = await this.chatService.sendMessage(userId, data.chatId, {
      text: data.text,
      attachments: data.attachments,
      replyTo: data.replyTo,
    });
    this.server.to(data.chatId).emit('message:new', { chatId: data.chatId, message });
    return message;
  }

  @SubscribeMessage('readMessages')
  async handleRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; messageIds?: string[] },
  ) {
    const userId = client.data.userId as string;
    await this.chatService.markRead(userId, data.chatId, { messageIds: data.messageIds });
    this.server.to(data.chatId).emit('message:read', { chatId: data.chatId, userId });
    return { success: true };
  }

  @SubscribeMessage('reaction')
  async handleReaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; emoji: string },
  ) {
    const userId = client.data.userId as string;
    const message = await this.chatService.toggleReaction(userId, data.messageId, { emoji: data.emoji });
    if (!message) {
      return null;
    }
    this.server.to(message.chat.toString()).emit('message:reaction', { message });
    return message;
  }

  @SubscribeMessage('deleteMessage')
  async handleDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; scope: 'me' | 'everyone' },
  ) {
    const userId = client.data.userId as string;
    const result = await this.chatService.deleteMessage(userId, data.messageId, { scope: data.scope });
    const chatId = (result as any).chatId;
    if (chatId) {
      this.server.to(chatId).emit('message:deleted', {
        messageId: data.messageId,
        scope: data.scope,
        userId,
      });
    } else {
      this.server.emit('message:deleted', { messageId: data.messageId, scope: data.scope, userId });
    }
    return { success: true };
  }
}
