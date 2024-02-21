import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleWare } from 'src/auth/ws-jwt/ws-jwt.middleware';
import { UseGuards } from '@nestjs/common';
import { GuardGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { AuthenticatedSocket } from 'src/gateway/interfaces/gateway.interface';
import { GatewaySessionManager } from './cache/gateway.session';
import { UserRole } from 'src/user/model/user.entity';

@WebSocketGateway()
@UseGuards(GuardGuard)
export class ChatGateway {
  
  constructor(
    private readonly chatService: ChatService,
    private sessions:GatewaySessionManager) {}

  afterInit(client:Socket) {
    client.use(SocketAuthMiddleWare() as any);
  }

  @WebSocketServer()
    server: Server;

  handleDisconnect(socket: AuthenticatedSocket) {
      console.log('disconnect')
      this.sessions.removeUserSocket(socket.user.id);
  }
  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    if(socket.user.role === UserRole.ADMIN) {
      this.sessions.addAdmin(socket);
      
    } else {
      this.sessions.setUserSocket(socket.user.id, socket);
      socket.emit('connected', {});
    }
    
  }

  @UseGuards(GuardGuard)
  @SubscribeMessage('toAdmin')
  create(client:AuthenticatedSocket, data:any) {
    if(this.sessions.getAdmin()) {
      const room = this.makeRoom(client, this.sessions.getAdmin());
      client.broadcast.to(room).emit('receivedMessage', {data})
    } else {

    }
    //client.join(`conversation-${client.user.id}`)
  }

  @SubscribeMessage('findAll')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOne')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('update')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('remove')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }

  private makeRoom(client:AuthenticatedSocket, admin:AuthenticatedSocket) {
    const roomName = `conversation-${client.user.id}`;
    client.join(roomName);
    admin.join(roomName);
    return roomName;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client:AuthenticatedSocket, data:any): Promise<void> {
    const {senderId, receiverId, content } = data;
    
    //this.server.to(senderId).to(receiverId).emit('newMessage', message);
  }
}
