import { BadRequestException, forwardRef, Inject, Injectable, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookService } from "src/book/book.service";
import { ReviewDto } from "src/book/review.dto";
import { BorrowRecordDto } from "src/borrower-record/borrowerrecord.model";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { PackageService } from "src/package/package.service";
import { User } from "./user.model";
import { Book, RequestedBook } from "../book/book.model"
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class UserService {

    constructor(
        @InjectModel("User") private readonly userModel: Model<User>,
        private readonly bookService: BookService,
        @Inject(forwardRef(() => BorrowerRecordService)) private readonly borrowerRecordService: BorrowerRecordService,
        private readonly packageService: PackageService,
        @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService) {}

    async getUsers() {
        return await this.userModel.find().populate("currentPackage");
    }

    async getProfile(id: string) {
        return await this.userModel.findById(id).populate("currentPackage");
    }
    
    async addReview(dto: ReviewDto, userId: string, bookId: string) {
        return this.bookService.addReview(dto, userId, bookId);
    }

    async addRequestedBook(dto: RequestedBook, userId: string) {
        const user = await this.userModel.findById(userId);
        return this.bookService.addRequestedBook(dto, user);
    }

    async checkQuantity(dto: [BorrowRecordDto]) {
        for (let i = 0; i<dto.length; ++i) {
            if (!(await this.bookService.checkQuantity(dto[i].id, dto[i].quantity))) return false;
        } 
        return true
    }

    async borrowBook(dto: [BorrowRecordDto], userId: string) { 
        await this.validate(dto, userId);
        await this.setIsBorrowing(userId, true);                       
        return this.borrowerRecordService.addRecord(dto, userId);
    }

    async validate(dto: [BorrowRecordDto], userId: string) {
        const user = await this.userModel.findById(userId);
        const currentPackage = await this.packageService.getPackageById(user.currentPackage);
        var quantitySum = 0;
        dto.forEach(value => {
            quantitySum += value.quantity
        });
        if (quantitySum > currentPackage.booksPerLoan) throw new BadRequestException();
        if (user.expiration == null || user.expiration < new Date(Date.now())) throw new BadRequestException();
        if (user.isBorrowing) throw new BadRequestException();
    }

    async getUserRecord(userId: string) {
        return this.borrowerRecordService.getUserRecord(userId);
    }

    async returnBook(recordId: string, userId: string) {                          
        return this.borrowerRecordService.return(recordId, userId);
    }

    async buyPackage(packageId: string, userId: string) {
        const user = await this.userModel.findById(userId);
        if (user.expiration != null && user.expiration >= new Date(Date.now())) {
            throw new BadRequestException();
        }
        const packageInfo = await this.packageService.getPackageById(packageId); 
        const timeOfOneDay = 3600 * 1000 * 24;
        user.currentPackage = packageId;
        user.expiration = new Date(Date.now() + packageInfo.time *30*timeOfOneDay)
        await user.save();
    }

    async setIsBorrowing(userId: string, state: boolean) {
        const user = await this.userModel.findById(userId);
        user.isBorrowing = state;
        await user.save() 
    }
        
    async getBorrowingBooks(userId: string) {
        return this.borrowerRecordService.getBorrowingBooks(userId);
    }

    async getRecentBooks(userId: string) {
        return this.borrowerRecordService.getRecentBooks(userId);
    }

    async getRequestedBooks(userId: string) {
        return this.bookService.getUserRequestedBooks(userId);
    }
    
    async deleteRequestedBook(bookId: string) {
        return this.bookService.deleteBook(bookId);
    }

    async addDeviceId(deviceId: string, userId: string) {
        const user = await this.userModel.findById(userId);
        if (user.deviceIds == null) {   
            user.deviceIds.push(deviceId);
            await user.save();
            return;
        } 
        const checkDeviceIdExist = await this.userModel.findOne({
            _id: userId,
            deviceIds: deviceId
        });
        if (checkDeviceIdExist) return;
       
        user.deviceIds.push(deviceId);
        await user.save();
    }

    async deleteDeviceId(deviceId: string, userId: string) {
        await this.userModel.updateOne({
            _id: userId
        }, {
            $pull: {
                deviceIds: deviceId
            }
        });
    }

    async getNotification(userId: string) {
        return this.notificationService.getNotifications(userId);
    }

    async deleteNotification(userId: string, notificationId: string) {
        return this.notificationService.deleteNotification(userId, notificationId);
    }

    async getRecords() {
        return await this.borrowerRecordService.getAllRecords();
    }

    async getAdmin() {
        return await this.userModel.find({
            role: "admin"
        });
    }
}