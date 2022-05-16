import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { BookModule } from "src/book/book.module";
import { BorrowerRecordModule } from "src/borrower-record/borrowerrecord.module";
import { PackageModule } from "src/package/package.module";
import { UserSchema } from "../user/user.model";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "User", schema: UserSchema}]), 
    PassportModule, BookModule, BorrowerRecordModule, PackageModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}