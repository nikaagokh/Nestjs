import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService) {}

    async generateJwt(user:any) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(user),
            this.jwtService.signAsync({user}, {
                expiresIn:'1d'
            })
        ])
        return {accessToken, refreshToken}

    }

    async generateAccess(user:any) {
        return await this.jwtService.signAsync(user); 
    }

    async hashPassword(password:string) {
        return await bcrypt.hash(password, 13);
    }

    async comparePassword(password:string, hashedpassword:string) {
        return await bcrypt.compare(password, hashedpassword);
    }
}