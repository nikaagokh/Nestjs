import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseFilePipeBuilder, ParseIntPipe, Post, Res, UploadedFile, UploadedFiles, UseInterceptors, } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import path = require('path');
import {uuid} from 'uuidv4';
import { CustomUploadFileTypeValidator } from './images/validator/customvalidator';
import { join } from 'path';

const allowedFileTypes = ['.jpg', '.jpeg', '.svg'];

export const storage =  {
  storage: diskStorage({
      destination:'./uploads/products',
      filename:(req, file, cb) => {
            const filename:string = path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
            const extension:string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
            
          
      },
  }),
  fileFilter : (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|svg| webp)$/)) {
      return cb(null, false);
    }
    
    cb(null, true);
  }
}

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;

@Controller('a')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 4, storage))
  uploadFiles(@UploadedFiles() files:Express.Multer.File) {
      console.log(files);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file',4,storage))
  uploadPhoto(@UploadedFiles() files:Array<Express.Multer.File>, @Body() body) {
    console.log(body)
    //this.appService.getHello(files, body.data)
  }
  @Get('images/:id')
  getImages(@Param('id', ParseIntPipe) id:number) {
    
    //return this.appService.getImages(id);
    
  }
  /*
  @Post('up')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadsFiles(@UploadedFiles(
    new ParseFilePipeBuilder()
      .addValidator(
         new CustomUploadFileTypeValidator({
          fileType:VALID_TYPES
         }),
      ).addMaxSizeValidator({maxSize:MAX_PROFILE_PICTURE_SIZE_IN_BYTES})
      .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) files, @Body() body) {
    console.log(files);
    console.log(body)
  }
  */

  @Post('logos')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file:Express.Multer.File, @Body() id:any) {
      //return this.appService.addLogo(file, id.data);
  }
  

  @Get('logos/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res):Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/logos/' + imagename)))
    }
  
  /*
   @Get()
   uploadCategories() {
    return this.appService.addCategories();
   }

   */

   @Get('s')
   get() {
    console.log(123);
    return [1,2,3,4];
   }
  


}
