import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BorrowerRecord, BorrowRecordDto } from "./borrowerrecord.model";
import { Model } from "mongoose";
import { BookService } from "src/book/book.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class BorrowerRecordService {
    constructor(@InjectModel("BorrowerRecord") private readonly borrowerRecordModel: Model<BorrowerRecord>,
    private readonly bookService: BookService) {}

    async addRecord(dto: [BorrowRecordDto], userId: string) {
        for (let i=0; i<dto.length; ++i) {
            dto[i].book = dto[i].id;
        }
        const newRecord = new this.borrowerRecordModel({
            user: userId,
            books: dto,
            status: "Pending confirm"
        });
        for (let i = 0; i<dto.length; ++i) {
            if (!(await this.bookService.checkQuantity(dto[i].id, dto[i].quantity))) throw new BadRequestException();
        }   
        dto.forEach((book) => {
            this.bookService.editQuantity(book.id, book.quantity);
        });
        const result = await newRecord.save();
        return result.id;
    }

    async getUserRecord(userId: string) {
        return this.borrowerRecordModel.find({user: userId}).populate(["user", "books"]);
    }

    async confirmBorrow(recordId: string) {
        const record = await this.borrowerRecordModel.findById(recordId);
        record.status = "Borrowing";
        record.createdDate = new Date(Date.now());
        const timeOfOneDay = 3600 * 1000 * 24;
        record.returnDate = new Date(Date.now() + timeOfOneDay * 7);
        for (let i = 0; i < record.books.length; ++i) {
            this.bookService.increaseBorrowedNum(record.books[i].book);
        }
        const result = await record.save();
        return result.id;
    }

    async return(recordId: string, userId) {
        const record = await this.borrowerRecordModel.findById(recordId);
        if (record.user != userId) throw new BadRequestException();
        record.status = "Pending return";
        const result = await record.save();
        return result.id;
    }

    async confirmReturn(recordId: string) {
        const record = await this.borrowerRecordModel.findById(recordId);
        record.status = "Returned";
        const result = await record.save();
        return result.id;
    }

    async getBorrowingBooks(userId: string) {
        return await this.borrowerRecordModel.findOne({ user: userId, $or : [
            {
                status: "Pending confirm"
            },
            {
                status: "Borrowing"
            },
            {
                status: "Pending return"
            }
        ]}).populate({
            path: "books.book",
            populate: [{
                path: "reviews.user",
                populate: {
                    path: "currentPackage"
                }
            },
            {
                path: "category"
            }]
        }).populate({
            path: "user",
            populate: {
                path: "currentPackage"
            }
        });
    }

    async getRecentBooks(userId: string) {
        const returnedBook = await this.borrowerRecordModel.find({status: "Returned", user: userId});
        const set = new Set([]);
        for (let i=0; i<returnedBook.length; ++i) {
            for (let j=0; j<returnedBook[i].books.length; ++j) {
                set.add(returnedBook[i].books[j].book.toString());
            }
        }
        const res = [];
        for (var id of set) {
            const book = await this.bookService.getBookById(id);
            res.push(book)
        }
        return res;
    }
}