import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BorrowerRecord } from "./borrowerrecord.model";
import { Model } from "mongoose";
import { BookService } from "src/book/book.service";

@Injectable()
export class BorrowerRecordService {
    constructor(@InjectModel("BorrowerRecord") private readonly borrowerRecordModel: Model<BorrowerRecord>,
    private readonly bookService: BookService) {}

    async addRecord(dto: BorrowerRecord, userId: string) {
        const newRecord = new this.borrowerRecordModel({
            user: userId,
            books: dto.books,
            status: "pending"
        });
        for (let i = 0; i<dto.books.length; ++i) {
            if (!(await this.bookService.checkQuantity(dto.books[i].book, dto.books[i].quantity))) throw new BadRequestException();
        }   
        dto.books.forEach((book) => {
            this.bookService.editQuantity(book.book, book.quantity);
        });
        const result = await newRecord.save();
        return result.id;
    }

    async getUserRecord(userId: string) {
        return this.borrowerRecordModel.find({user: userId}).populate(["user", "books"]);
    }

    async confirmBorrow(recordId: string) {
        const record = await this.borrowerRecordModel.findById(recordId);
        record.status = "borrowing";
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
        record.status = "return pending";
        const result = await record.save();
        return result.id;
    }

    async confirmReturn(recordId: string) {
        const record = await this.borrowerRecordModel.findById(recordId);
        record.status = "returned";
        const result = await record.save();
        return result.id;
    }
}