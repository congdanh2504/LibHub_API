import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Role from "src/auth/guards/role.enum";
import RoleGuard from "src/auth/guards/role.guard";
import { RequestedBook } from "src/book/book.model";
import { ReviewDto } from "src/book/review.dto";
import { BorrowerRecord } from "src/borrower-record/borrowerrecord.model";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard, RoleGuard(Role.User))
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("profile")
    getProfile(@Request() req) {
        return this.userService.getProfile(req.user.id);
    }

    @Post("addreview/:bookId")
    addReview(@Body() dto: ReviewDto,@Param() param: any, @Request() req) {
        return this.userService.addReview(dto, req.user.id, param.bookId);
    }

    @Post("addrequestedbook")
    addRequestedBook(@Body() dto: RequestedBook, @Request() req) {
        return this.userService.addRequestedBook(dto, req.user.id);
    }

    @Post("borrowbook")
    borrowBook(@Body() dto: BorrowerRecord, @Request() req) {
        return this.userService.borrowBook(dto, req.user.id);
    }

    @Get("userrecord")
    getUserRecord(@Request() req) {
        return this.userService.getUserRecord(req.user.id);
    }

    @Post("returnbook/:id")
    returnBook(@Param() param: any, @Request() req) {
        return this.userService.returnBook(param.id, req.user.id);
    }
}