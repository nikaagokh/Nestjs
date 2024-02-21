import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable, map} from "rxjs";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector:Reflector, 
        private userService:UserService
    ) {
        
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log(roles)
        
        if(!roles) {
            return true;
        }
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        
        const find = await this.userService.findOne(user.id);
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermission:boolean = false;
        if(hasRole()) {
            hasPermission = true;
        }
        return user && hasPermission;
        
    }
}
