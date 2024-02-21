import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './passport/jwt-strategy';
import { RefreshJwtStrategy } from './passport/refresh-strategy';
import { RefreshJwtGuard } from './guards/refresh.guard';
@Module({
    imports:[
        JwtModule.register({
            secret:`${process.env.jwt_secret}`,
            signOptions:{expiresIn:'7600s'}
        }),
        forwardRef(() => UserModule)
       
    ],
    providers:[AuthService, RolesGuard, JwtAuthGuard, JwtStrategy, RefreshJwtStrategy, RefreshJwtGuard],
    exports:[AuthService]
})
export class AuthModule {}
