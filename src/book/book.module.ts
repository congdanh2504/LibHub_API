import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookController } from "./book.controller";
import { BookSchema } from "./book.model";
import { BookService } from "./book.service";


@Module({
    imports: [MongooseModule.forFeature([{name: "Book", schema: BookSchema}])],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BookModule {}