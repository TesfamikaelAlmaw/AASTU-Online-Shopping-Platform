import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
    CloudinaryModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
