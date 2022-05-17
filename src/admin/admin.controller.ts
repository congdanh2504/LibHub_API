import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Role from "src/auth/guards/role.enum";
import RoleGuard from "src/auth/guards/role.guard";
import { Book } from "src/book/book.model";
import { BookService } from "src/book/book.service";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { Category } from "src/category/category.model";
import { CategoryService } from "src/category/category.service";
import { Package } from "src/package/package.model";
import { PackageService } from "src/package/package.service";
import { UserService } from "src/user/user.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
export class AdminController {
    constructor(private readonly bookService: BookService,
        private readonly borrowerRecordService: BorrowerRecordService,
        private readonly categoryService: CategoryService,
        private readonly packageService: PackageService,
        private readonly userService: UserService) {}

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
    async confirmReturnRecord(@Param() param: any) {
        await this.userService.setIsBorrowing(param.id, false);
        return this.borrowerRecordService.confirmReturn(param.id);
    }

    @Post("category")
    addCategory(@Body() category: Category) {
        return this.categoryService.addCategory(category);
    }

    @Post("package")
    addPackage(@Body() pack: Package) {
        return this.packageService.addPackage(pack);
    }
}