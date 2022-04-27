import { Injectable, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "./user.model";

@Injectable()
export class UserService {

    constructor(
        @InjectModel("User") private readonly userModel: Model<User>) {}

    async getProfile(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }
    
}