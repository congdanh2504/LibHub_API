import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GoogleDriveService } from './googledrive/googledrive.service';
import { extname } from 'path'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: GoogleDriveService, 
    private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
      return this.userService.getProfile(req.user.id);
  }

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
