import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
   
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
      ignoreExpiration: false,
      secretOrKey:`${process.env.jwt_secret}`,
      
    });
   }

  async validate(payload: any) {
    return {...payload.user};
  }
  
}