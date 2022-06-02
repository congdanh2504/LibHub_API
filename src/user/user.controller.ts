import { Body, Controller, Delete, Get, Param, Post, Query, Req, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Role from "src/auth/guards/role.enum";
import RoleGuard from "src/auth/guards/role.guard";
import { Book, RequestedBook } from "src/book/book.model";
import { ReviewDto } from "src/book/review.dto";
import { BorrowerRecord, BorrowRecordDto } from "src/borrower-record/borrowerrecord.model";
import { User } from "./user.model";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    updateProfile(@Body() dto: User, @Request() req) {
        return this.userService.updateProfile(dto, req.user.id);
    }

    @Post("addreview/:bookId")
    addReview(@Body() dto: ReviewDto,@Param() param: any, @Request() req) {
        return this.userService.addReview(dto, req.user.id, param.bookId);
    }

    @Post("requestbook")
    addRequestedBook(@Body() dto: RequestedBook, @Request() req) {  
        dto.category = dto.category["_id"];
        return this.userService.addRequestedBook(dto, req.user.id);
    }

    @Post("checkquantity")
    checkQuantity(@Body() dto: [BorrowRecordDto]) {
        return this.userService.checkQuantity(dto);
    }

    @Post("borrowbook")
    borrowBook(@Body() dto: [BorrowRecordDto], @Request() req) {
        return this.userService.borrowBook(dto, req.user.id);
    }

    @Get("userrecord")
    getUserRecord(@Request() req) {
        return this.userService.getUserRecord(req.user.id);
    }

    @Post("returnbook/:recordId")
    returnBook(@Param() param: any, @Request() req) {
        return this.userService.returnBook(param.recordId, req.user.id);
    }

    @Post("buypackage/:packageId")
    buyPackage(@Param() param: any, @Request() req) {
        return this.userService.buyPackage(param.packageId, req.user.id);
    }

    @Get("borrowingbooks")
    getBorrowingBooks(@Request() req) {
        return this.userService.getBorrowingBooks(req.user.id);
    }

    @Get("recentbooks")
    getRecentBooks(@Request() req, @Query("skip") skip: number, @Query("limit") limit: number) {
        return this.userService.getRecentBooks(req.user.id, skip, limit);
    }

    @Get("requestedbooks")
    getRequestedBooks(@Request() req, @Query("skip") skip: number, @Query("limit") limit: number) {
        return this.userService.getRequestedBooks(req.user.id, skip, limit);
    }

    @Delete("requestedbook/:bookId")
    deleteRequestedBook(@Param() param: any) {
        return this.userService.deleteRequestedBook(param.bookId);
    }

    @Post("deviceid")
    addDeviceId(@Query('deviceId') deviceId, @Request() req) {
        return this.userService.addDeviceId(deviceId, req.user.id);
    }

    @Delete("deviceid")
    deleteDeviceId(@Query('deviceId') deviceId, @Request() req) {
        return this.userService.deleteDeviceId(deviceId, req.user.id);
    }

    @Get("notification")
    getNotifications(@Request() req) {
        return this.userService.getNotification(req.user.id);
    }

    @Delete("notification/:notificationId")
    deleteNotification(@Param() param: any, @Request() req) {
        return this.userService.deleteNotification(req.user.id, param.notificationId);
    }
}