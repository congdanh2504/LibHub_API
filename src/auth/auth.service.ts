import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../user/user.model";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./auth.dto";

@Injectable()
export class AuthService {

    constructor(
        @InjectModel("User") private readonly userModel: Model<User>,
        private readonly jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user =  await this.userModel.findOne({username: username});
        if (!user || !(await bcrypt.compare(password, user.password))) return null;
        return user;
    }

    async signUp(dto: AuthDto): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);
        const user = new this.userModel({
            username: dto.username, 
            password: hashedPassword, 
            email: dto.email, 
            role: "user",
            borrowingNum: 0
        });
        const result = await user.save();
        return result._id as unknown as string;
    }

    async signIn(user: User) {
        const payload = { username: user.username, id: user.id, email: user.email, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}