import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { query } from "express";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { BookService } from "./book.service";

@Controller("book")
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAllBooks(@Query("page") page: number) {
        const books = await this.bookService.getAllBooks();
        const booksPage = await this.bookService.getAllBooksPaginate(page);
        return {
            data: booksPage,
            activePage: page,
            totalItemsCount: books.length,
        }
    }

    @Get("search")
    search(@Query("query") query: string, @Query("skip") skip: number = 0, @Query("limit") limit: number) {
        return this.bookService.search(query, skip, limit);
    }

    @Get("category/:categoryId")
    getBooksByCategory(@Param() param: any, @Query("skip") skip: number = 0, @Query("limit") limit: number) {
        return this.bookService.getBooksByCategory(param.categoryId, skip, limit);
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