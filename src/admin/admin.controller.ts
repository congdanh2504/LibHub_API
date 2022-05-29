import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import Role from "src/auth/guards/role.enum";
import RoleGuard from "src/auth/guards/role.guard";
import { Book } from "src/book/book.model";
import { BookService } from "src/book/book.service";
import { BorrowState } from "src/borrower-record/borrowerrecord.enum";
import { BorrowerRecordService } from "src/borrower-record/borrowerrecord.service";
import { Category } from "src/category/category.model";
import { CategoryService } from "src/category/category.service";
import { NotificationService } from "src/notification/notification.service";
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
        private readonly userService: UserService,
        private readonly notificationService: NotificationService) {}

    @Get("user")
    async getUsers(@Query("page") page: number) {
        const users = await this.userService.getUsers();
        const usersPage = await this.userService.getUsersPaginate(page);
        return {
            data: usersPage,
            activePage: page,
            totalItemsCount: users.length,
        }
    }

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

    @Get("record/:recordId")
    getRecordById(@Param() param: any) {
        return this.borrowerRecordService.getRecordById(param.recordId);
    }

    @Post("confirm/:recordId")
    async confirm(@Param() param: any) {
        const record = await this.borrowerRecordService.getRecordById(param.recordId);
        if (record.status == BorrowState.PendingConfirm) {
            return this.confirmBorrow(param.recordId);
        } else if (record.status == BorrowState.PendingReturn) {
            return await this.confirmReturnRecord(param.recordId);
        } else {
            throw new BadRequestException();
        }
    }
   
    async confirmBorrow(recordId: string) {
        return this.borrowerRecordService.confirmBorrow(recordId);
    }

    async confirmReturnRecord(recordId: string) {
        const record = await this.borrowerRecordService.getRecordById(recordId);
        await this.userService.setIsBorrowing(record.user, false);
        return this.borrowerRecordService.confirmReturn(recordId);
    }

    @Post("category")
    addCategory(@Body() category: Category) {
        return this.categoryService.addCategory(category);
    }

    @Post("package")
    addPackage(@Body() pack: Package) {
        return this.packageService.addPackage(pack);
    }

    @Patch("package/:packageId")
    updatePackage(@Param() param: any, @Body() pack: Package) {
        return this.packageService.updatePackage(pack, param.packageId);
    }

    @Delete("package/:packageId")
    deletePackage(@Param() param: any) {
        return this.packageService.deletePackage(param.packageId);
    }

    @Get("recordpaginate")
    async getAllRecordsPaginate(@Query("page") page: number) {
        const records = await this.borrowerRecordService.getRecordNum();
        const recordsPaginate = await this.borrowerRecordService.getAllRecordsPaginate(page);
        return {
            data: recordsPaginate,
            activePage: page,
            totalItemsCount: records,
        }
    }

    @Get("requestedbookspaginate")
    async getRequestedBooksPaginate(@Query("page") page: number) {
        const books = await this.bookService.getRequestedBooksNum();
        const booksPaginate = await this.bookService.getRequestedBooksPaginate(page);
        return {
            data: booksPaginate,
            activePage: page,
            totalItemsCount: books,
        }
    }

    @Get("record")
    getAllRecords(@Query("skip") skip: number, @Query("limit") limit: number) {
        return this.borrowerRecordService.getAllRecords(skip, limit);
    }

    @Get("requestedbooks")
    getRequestedBooks( @Query("skip") skip: number, @Query("limit") limit: number) {
        return this.bookService.getRequestedBooks(skip, limit);
    }

    @Post("acceptrequest/:bookId")
    acceptRequest(@Param() param: any) {
        return this.bookService.acceptRequest(param.bookId);    
    }

    @Get("report")
    async getReport() {
        const recordNumByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const records = await this.borrowerRecordService.getAllRecords(0, 1000);
        const currentDate = new Date(Date.now());
        for (let i=0; i<records.length; ++i) {
            if (currentDate.getFullYear() == records[i].createdDate.getFullYear()) {
                ++recordNumByMonth[records[i].createdDate.getMonth()];
            }
        }
        const packages = await this.packageService.getPackages();
        const packageNames = [];
        const packageIds = [];
        const purchaseNum = [];
        for (let i=0; i<packages.length; ++i) {
            packageNames.push(packages[i].name);
            packageIds.push(packages[i]._id.toString());
            purchaseNum.push(0);
        }
        const users = await this.userService.getUsers();
        for (let i=0; i<users.length; ++i) {
            if (users[i].currentPackage == null) continue;
            ++purchaseNum[packageIds.indexOf(users[i].currentPackage["_id"].toString())];
        }
        return {recordNumByMonth: recordNumByMonth, package: {
            name: packageNames,
            purchaseNum: purchaseNum
        }};
    }

    @Get("notification")
    getNotifications(@Request() req) {
        return this.notificationService.getNotifications(req.user.id);
    }
}