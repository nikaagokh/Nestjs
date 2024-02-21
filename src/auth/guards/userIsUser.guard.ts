import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { UserService } from "src/user/service/user.service";


@Injectable()
export class UserIsUserGuard implements CanActivate {
    constructor(
        private userService:UserService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const params = request.params;
        const find = await this.userService.findOne(user.id);
        if(!find) return false;
        if(find.id === Number(params.id)) {
            return true;
        }
    }
   
    
}
