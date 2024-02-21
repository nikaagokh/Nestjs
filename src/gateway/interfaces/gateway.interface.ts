import { User } from 'src/user/model/user.entity';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: any;
}
