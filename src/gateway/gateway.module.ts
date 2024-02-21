import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateway.socket';
import { GatewaySessionManager } from './gateway.session';

@Module({
    providers:[]
})
export class GatewayModule {}
