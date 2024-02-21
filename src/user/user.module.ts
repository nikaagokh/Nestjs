import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './service/user.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule)
    ],
    providers:[UserService],
    controllers:[UserController],
    exports:[UserService]
})
export class UserModule {}
