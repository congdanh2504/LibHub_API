import { Body, Controller, Get, Post, Req, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RequestedBook } from "src/book/book.model";
import { ReviewDto } from "src/book/review.dto";
import { BorrowerRecord } from "src/borrower-record/borrowerrecord.model";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Request() req) {
        return this.userService.getProfile(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("addreview")
    addReview(@Body() dto: ReviewDto, @Request() req) {
        return this.userService.addReview(dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("addrequestedbook")
    addRequestedBook(@Body() dto: RequestedBook, @Request() req) {
        return this.userService.addRequestedBook(dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("borrowbook")
    borrowBook(@Body() dto: BorrowerRecord, @Request() req) {
        return this.userService.borrowBook(dto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("userrecord")
    getUserRecord(@Request() req) {
        return this.userService.getUserRecord(req.user.id);
    }
}