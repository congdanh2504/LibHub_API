import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JWT_SECRET } from "src/constants";
import { UserSchema } from "../user/user.model";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "User", schema: UserSchema}]), 
    PassportModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}