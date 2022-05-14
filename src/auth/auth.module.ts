import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JWT_SECRET } from "src/constants";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { UserSchema } from "../user/user.model";
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [MongooseModule.forFeature([{name: "User", schema: UserSchema}]), 
    PassportModule, 
    JwtModule.register({
        secret: JWT_SECRET,
        signOptions: { expiresIn: '30d' },
      }), HttpModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}