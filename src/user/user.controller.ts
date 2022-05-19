import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Role from "src/auth/guards/role.enum";
import RoleGuard from "src/auth/guards/role.guard";
import { RequestedBook } from "src/book/book.model";
import { ReviewDto } from "src/book/review.dto";
import { BorrowerRecord, BorrowRecordDto } from "src/borrower-record/borrowerrecord.model";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard, RoleGuard(Role.User))
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

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
    getRecentBooks(@Request() req) {
        return this.userService.getRecentBooks(req.user.id);
    }

    @Get("requestedbooks")
    getRequestedBooks(@Request() req) {
        return this.userService.getRequestedBooks(req.user.id);
    }
}