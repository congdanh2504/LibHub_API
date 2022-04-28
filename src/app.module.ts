import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGODB_URL } from './constants';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HttpModule } from '@nestjs/axios';
import { BookModule } from './book/book.module';
import { GoogleDriveModule } from './googledrive/googledrive.module';

@Module({
  imports: [MongooseModule.forRoot(MONGODB_URL), AuthModule, UserModule, HttpModule, BookModule, GoogleDriveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
