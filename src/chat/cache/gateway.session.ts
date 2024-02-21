import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from 'src/gateway/interfaces/gateway.interface'; 
import { UserRole } from 'src/user/model/user.entity';



export interface IGatewaySessionManager {
  getUserSocket(id: number): AuthenticatedSocket;
  setUserSocket(id: number, socket: AuthenticatedSocket): void;
  removeUserSocket(id: number): void;
  getSockets(): Map<number, AuthenticatedSocket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private sessions: Map<number, AuthenticatedSocket> = new Map();
  private admin: AuthenticatedSocket | null = null;

  getUserSocket(id: number) {
    return this.sessions.get(id);
  }

  addAdmin(socket:AuthenticatedSocket) {
    this.admin = socket;
  }

  setUserSocket(userId: number, socket: AuthenticatedSocket) {
    this.sessions.set(userId, socket);
    console.log(this.sessions)
  }
  removeUserSocket(userId: number) {
    this.sessions.delete(userId);
    console.log(this.sessions)
  }
  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
  getAdmin():AuthenticatedSocket {
    return this.admin;
  }
}
