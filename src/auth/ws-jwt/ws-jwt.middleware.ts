import {Socket} from 'socket.io';
import { GuardGuard } from './ws-jwt.guard';
import { AuthenticatedSocket } from 'src/gateway/interfaces/gateway.interface';

export type SocketIoMiddleWare = {
    (client:AuthenticatedSocket, next : (err?:Error) => void)
}

export const SocketAuthMiddleWare = ():SocketIoMiddleWare => {
    return (client, next) => {
        try {
            const user = GuardGuard.validateToken(client);
            client.user = user;
            next();
        } catch (err) {
            next(err);
        }
    }
}