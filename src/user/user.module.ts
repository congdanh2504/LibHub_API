import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { BookModule } from "src/book/book.module";
import { BorrowerRecordModule } from "src/borrower-record/borrowerrecord.module";
import { PackageModule } from "src/package/package.module";
import { UserSchema } from "../user/user.model";
import { CronService } from "./cron.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "User", schema: UserSchema}]), 
    PassportModule, BookModule, forwardRef(() => BorrowerRecordModule), PackageModule,
    ScheduleModule.forRoot()],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}