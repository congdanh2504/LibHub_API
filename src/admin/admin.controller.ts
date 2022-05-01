import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Role from "src/auth/guards/role.enum";
import RoleGuard from "src/auth/guards/role.guard";
import { Book } from "src/book/book.model";
import { BookService } from "src/book/book.service";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { Category } from "src/category/category.model";
import { CategoryService } from "src/category/category.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
export class AdminController {
    constructor(private readonly bookService: BookService,
        private readonly borrowerRecordService: BorrowerRecordService,
        private readonly categoryService: CategoryService) {}

    @Post("book")
    addBook(@Body() book: Book) {
        return this.bookService.addBook(book);
    }

    @Delete("book/:id")
    deleteBook(@Param() param: any) {
        return this.bookService.deleteBook(param.id);
    }

    @Patch("book/:id")
    updateBook(@Param() param: any, @Body() book: Book) {
        return this.bookService.updateBook(param.id, book);
    }

    @Patch("confirm/:id")
    confirmBorrowerRecord(@Param() param: any) {
        return this.borrowerRecordService.confirmBorrow(param.id);
    }

    @Patch("confirmreturn/:id")
    confirmReturnRecord(@Param() param: any) {
        return this.borrowerRecordService.confirmReturn(param.id);
    }

    @Post("category")
    addCategory(@Body() category: Category) {
        return this.categoryService.addCategory(category);
    }
}