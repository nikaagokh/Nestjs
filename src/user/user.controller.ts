import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User, UserRole } from './model/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './service/user.service';
import { RefreshJwtGuard } from 'src/auth/guards/refresh.guard';
import { hasRoles } from 'src/auth/guards/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserIsUserGuard } from 'src/auth/guards/userIsUser.guard';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { LoginUserDto } from './dtos/loginUserDto';


@Controller('user')
export class UserController {
    constructor(
        private userService:UserService
    ) {}

    @Post('register')
    registerUser(@Body() user:CreateUserDto) {
        return this.userService.registerUser(user);
    }

    @Post('login')
    loginUser(@Body() user:LoginUserDto) {
        return this.userService.loginUser(user);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    refreshToken(@Request() req:any) {
        const user = req.user;
        return this.userService.refreshToken(user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('role/:id')
    updateRole(@Param('id', ParseIntPipe) id:number, @Body() user:any) {
        //return this.userService.updateRole(id, user);
    }

    //@hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number) {
        return this.userService.findOne(id);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('all')
    findAll() {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id', ParseIntPipe) id:number, @Body() user:any) {
        return this.userService.updateOne(id, user);
    }
}
