import { Module } from "@nestjs/common";
import { BookModule } from "src/book/book.module";
import { BorrowerRecordModule } from "src/borrower-record/borrowerrecord.module";
import { CategoryModule } from "src/category/category.module";
import { NotificationModule } from "src/notification/notification.module";
import { PackageModule } from "src/package/package.module";
import { PackageService } from "src/package/package.service";
import { UserModule } from "src/user/user.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
    imports: [BookModule, BorrowerRecordModule, CategoryModule, PackageModule, UserModule, NotificationModule],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule {}