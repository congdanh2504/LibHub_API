import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GoogleDriveService } from './googledrive/googledrive.service';
import { extname } from 'path'

@Controller()
export class AppController {
  constructor(private readonly appService: GoogleDriveService) {}

  @Post("getPicture")
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: '/uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  getPicture(@UploadedFile() file: Express.Multer.File) {
    return this.appService.getPicture(file);
  }
}
