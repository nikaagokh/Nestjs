import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class GuardGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if(context.getType() !== 'ws') {
      return true;
    }
    const client:Socket = context.switchToWs().getClient();
    const user = GuardGuard.validateToken(client);
    context.switchToHttp().getRequest().user = user;
    return Boolean(user);
  }

  static validateToken(client:Socket) {
    const {authorization} = client.handshake.headers;
    const token = authorization.split(' ')[1];
    const payload = verify(token, `${process.env.secret_key}`);
    return payload
  }
}
