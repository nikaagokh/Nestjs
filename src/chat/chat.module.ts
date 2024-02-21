import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { GatewaySessionManager } from './cache/gateway.session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChat } from './entities/user-chat..entity';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserChat, Message])
  ],
  providers: [ChatGateway, ChatService, GatewaySessionManager],
  controllers: [ChatController],
})
export class ChatModule {}
