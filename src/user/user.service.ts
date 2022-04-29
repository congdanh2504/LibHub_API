import { Injectable, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RequestedBook } from "src/book/book.model";
import { BookService } from "src/book/book.service";
import { ReviewDto } from "src/book/review.dto";
import { User } from "./user.model";

@Injectable()
export class UserService {

    constructor(
        @InjectModel("User") private readonly userModel: Model<User>,
        private readonly bookService: BookService) {}

    async getProfile(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }
    
    async addReview(dto: ReviewDto) {
        const user = await this.userModel.findById(dto.userId);
        return this.bookService.addReview(dto, user);
    }

    async addRequestedBook(dto: RequestedBook, userId: string) {
        const user = await this.userModel.findById(userId);
        return this.bookService.addRequestedBook(dto, user);
    }
}