import { Inject, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from './interfaces/gateway.interface';
import { IGatewaySessionManager } from './gateway.session';

@WebSocketGateway()
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    constructor(private readonly sessions:IGatewaySessionManager) {}
  onModuleInit() {
    throw new Error('Method not implemented.');
  }

    @WebSocketServer()
    server: Server;

    handleDisconnect(socket: AuthenticatedSocket) {
        console.log(`${socket.user.firstName} disconnected.`);
        this.sessions.removeUserSocket(socket.user.id);
    }
    handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
        this.sessions.setUserSocket(socket.user.id, socket);
        socket.emit('connected', {});    
    }

    @SubscribeMessage('message')
    handleMessage(socket:Socket, data:any) {
      console.log(data);
    }


    
  }