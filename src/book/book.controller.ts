import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { query } from "express";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { BookService } from "./book.service";

@Controller("book")
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    getAllBooks() {
        return this.bookService.getAllBooks();
    }

    @Get("search")
    search(@Query() query: any) {
        return this.bookService.search(query.query);
    }

    @Get("category/:categoryId")
    getBooksByCategory(@Param() param: any) {
        return this.bookService.getBooksByCategory(param.categoryId);
    }

    @Get("discover")
    getDiscover() {
        return this.bookService.getDiscover()
    }

    @Get(":id")
    getBookById(@Param() param: any) {
        return this.bookService.getBookById(param.id);
    }
    
    
}