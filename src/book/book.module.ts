import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BorrowerRecordModule } from "src/borrower-record/borrowerrecord.module";
import { CategoryModule } from "src/category/category.module";
import { NotificationModule } from "src/notification/notification.module";
import { BookController } from "./book.controller";
import { BookSchema } from "./book.model";
import { BookService } from "./book.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "Book", schema: BookSchema}]), NotificationModule],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BookModule {}