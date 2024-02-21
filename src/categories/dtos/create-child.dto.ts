import {IsNumber, IsString} from '@nestjs/class-validator'
export class CreateChild {
    @IsString()
    name:string;

    @IsNumber()
    range:number;

    @IsNumber()
    parentId:number;

}