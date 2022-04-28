import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Role from "src/auth/guards/role.enum";
import RoleGuard from "src/auth/guards/role.guard";
import { Book } from "./book.model";
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

    @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
    @Post()
    addBook(@Body() book: Book) {
        return this.bookService.addBook(book);
    }

    @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
    @Delete(":id")
    deleteBook(@Param() param: any) {
        return this.bookService.deleteBook(param.id);
    }

    @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
    @Patch(":id")
    updateBook(@Param() param: any, @Body() book: Book) {
        return this.bookService.updateBook(param.id, book);
    }
}