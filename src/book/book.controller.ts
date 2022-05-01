import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { BookService } from "./book.service";

@Controller("book")
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    getAllBooks() {
        return this.bookService.getAllBooks();
    }

    @Get(":id")
    getBookById(@Param() param: any) {
        return this.bookService.getBookById(param.id);
    }
}