import {IsNumber, IsString} from '@nestjs/class-validator'
export class CreateParent {
    @IsString()
    name:string;

}