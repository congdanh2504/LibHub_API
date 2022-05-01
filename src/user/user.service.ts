import { Injectable, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestedBook } from "src/book/book.model";
import { BookService } from "src/book/book.service";
import { ReviewDto } from "src/book/review.dto";
import { BorrowerRecord } from "src/borrower-record/borrowerrecord.model";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { User } from "./user.model";

@Injectable()
export class UserService {

    constructor(
        @InjectModel("User") private readonly userModel: Model<User>,
        private readonly bookService: BookService,
        private readonly borrowerRecordService: BorrowerRecordService) {}

    async getProfile(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }
    
    async addReview(dto: ReviewDto, userId: string) {
        return this.bookService.addReview(dto, userId);
    }

    async addRequestedBook(dto: RequestedBook, userId: string) {
        const user = await this.userModel.findById(userId);
        return this.bookService.addRequestedBook(dto, user);
    }

    async borrowBook(dto: BorrowerRecord, userId: string) {                          
        return this.borrowerRecordService.addRecord(dto, userId);
    }

    async getUserRecord(userId: string) {
        return this.borrowerRecordService.getUserRecord(userId);
    }

    async returnBook(recordId: string, userId: string) {                          
        return this.borrowerRecordService.return(recordId, userId);
    }
}