import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BorrowerRecord, BorrowRecordDto } from "./borrowerrecord.model";
import { Model } from "mongoose";
import { BookService } from "src/book/book.service";
import { BorrowState } from "./borrowerrecord.enum";
import { NotificationService } from "src/notification/notification.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class BorrowerRecordService {
    constructor(@InjectModel("BorrowerRecord") private readonly borrowerRecordModel: Model<BorrowerRecord>,
    private readonly bookService: BookService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

    async getRecordById(recordId: string) {
        return await this.borrowerRecordModel.findById(recordId).populate({
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

    async getRecordNum() {
        return await this.borrowerRecordModel.count();
    }

    async getAllRecordsPaginate(page: number) {
        return await this.borrowerRecordModel.find().skip((page-1)*10).limit(10).populate({
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
        }).sort({
            createdDate: "desc"
        });
    }

    async getAllRecords(skip: number, limit: number) {
        return await this.borrowerRecordModel.find().skip(skip).limit(limit).populate({
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
        }).sort({
            createdDate: "desc"
        });
    }

    async addRecord(dto: [BorrowRecordDto], userId: string) {
        for (let i=0; i<dto.length; ++i) {
            dto[i].book = dto[i].id;
        }
        const newRecord = new this.borrowerRecordModel({
            user: userId,
            books: dto,
            status: BorrowState.PendingConfirm
        });
        for (let i = 0; i<dto.length; ++i) {
            if (!(await this.bookService.checkQuantity(dto[i].id, dto[i].quantity))) throw new BadRequestException();
        }   
        dto.forEach((book) => {
            this.bookService.editQuantity(book.id, book.quantity);
        });
        const user = await this.userService.getProfile(userId);
        const result = await newRecord.save();
        const adminUsers = await this.userService.getAdmin();
        const message = `${user.username} just added a new borrowing record`;
        for (let i=0; i<adminUsers.length; ++i) {
            this.notificationService.addNotification(message, adminUsers[i].id);
        }
        return result.id;
    }

    async getUserRecord(userId: string) {
        return this.borrowerRecordModel.find({user: userId}).populate({
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

    async confirmBorrow(recordId: string) { 
        const record = await this.borrowerRecordModel.findById(recordId).populate({
            path: "user",
            populate: {
                path: "currentPackage"
            }
        });
        record.status = BorrowState.Borrowing;
        record.createdDate = new Date(Date.now());
        const timeOfOneDay = 3600 * 1000 * 24;
        const borrowDays = record.user["currentPackage"]["borrowDays"]
        record.returnDate = new Date(Date.now() + timeOfOneDay * borrowDays);
        for (let i = 0; i < record.books.length; ++i) {
            this.bookService.increaseBorrowedNum(record.books[i].book);
        }
        const result = await record.save();
        const message = "Admin was confirm your borrowing record";
        await this.notificationService.addNotification(message, record.user)
        return result.id;
    }

    async return(recordId: string, userId: string) {
        const record = await this.borrowerRecordModel.findById(recordId);
        if (record.user != userId) throw new BadRequestException();
        record.status = BorrowState.PendingReturn;
        const result = await record.save();
        const user = await this.userService.getProfile(userId);
        const adminUsers = await this.userService.getAdmin();
        const message = `${user.username} just added a return request`;
        for (let i=0; i<adminUsers.length; ++i) {
            this.notificationService.addNotification(message, adminUsers[i].id);
        }
        return result.id;
    }

    async confirmReturn(recordId: string) {
        const record = await this.borrowerRecordModel.findById(recordId);
        record.status = BorrowState.Returned;
        for (let i = 0; i < record.books.length; ++i) {
            await this.bookService.editQuantity(record.books[i].book, -record.books[i].quantity);
        }
        const result = await record.save();
        const message = "Admin was confirm your returning record";
        await this.notificationService.addNotification(message, record.user)
        return result.id;
    }

    async getBorrowingBooks(userId: string) {
        return await this.borrowerRecordModel.findOne({ user: userId, $or : [
            {
                status: BorrowState.PendingConfirm
            },
            {
                status: BorrowState.Borrowing
            },
            {
                status: BorrowState.PendingReturn
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

    async getRecentBooks(userId: string, skip: number, limit: number) {
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
        
        return res.slice(skip, skip + limit);
    }
}