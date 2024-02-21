import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { Repository } from "typeorm";
import { User } from "../model/user.entity";
import { CreateUserDto } from "../dtos/createUserDto";
import { create } from "domain";
import { LoginUserDto } from "../dtos/loginUserDto";
import { UpdateUserDto } from "../dtos/updateUserDto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo:Repository<User>,
        private authService:AuthService,
    ) {}

    async registerUser(user:CreateUserDto) {
        const hashpassword = await this.authService.hashPassword(user.password);
        const us = new User();
        us.email = user.email;
        us.firstName = user.firstName;
        us.lastName = user.lastName;
        us.password = hashpassword;
        us.phone = user.phone
        const createdUser = await this.userRepo.save(us)
        if(!createdUser) throw new HttpException('something went wrong, try again', HttpStatus.BAD_REQUEST);
        
        const {password, ...result} = createdUser;
        return result;
    }

    async loginUser(user:LoginUserDto) {
        const validation = await this.validateUser(user);
        console.log(validation)
        if(!validation) throw new HttpException('not validated', HttpStatus.BAD_REQUEST);
        const jwt = await this.authService.generateJwt(validation);
        console.log(jwt)
        return jwt;
    }

    private async validateUser(user:LoginUserDto) {
        const userFromDB = await this.userRepo.createQueryBuilder('us').where(`us.phone = '${user.phone}'`).getOne();
        console.log(userFromDB)
        if(!userFromDB) throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
        const match = await this.authService.comparePassword(user.password, userFromDB.password);
        console.log(match)
        if(!match) throw new HttpException('password not match', HttpStatus.BAD_REQUEST);
        const {password, ...result} = userFromDB;
        return result;
    }

    async refreshToken(user:any) {
        const token = await this.authService.generateAccess(user);
        return {accesstoken:token};

    }


    async findOne(id:number) {
        const user = await this.userRepo.createQueryBuilder('us').where(`us.id = ${id}`).getOne();
        const {password, ...result} = user;
        return result;
    }

    async findAll() {
        const users = await this.userRepo.createQueryBuilder('us').getMany();
        users.map((user) => {
            delete user.password;
        })
        return users;
    }

    async updateOne(id:number, user:UpdateUserDto) {
        const us = await this.userRepo.createQueryBuilder('user').where(`user.id = ${id}`).getOne();
        if(!us) throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
        const {password, ...result} = us;
        return result;
    }

    


}