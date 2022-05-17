import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookModule } from "src/book/book.module";
import { UserModule } from "src/user/user.module";
import { BorrowerRecordSchema } from "./borrowerrecord.model";
import { BorrowerRecordService } from "./borrowerrecord.service";


@Module({
    imports: [MongooseModule.forFeature([{name: "BorrowerRecord", schema: BorrowerRecordSchema}]), BookModule],
    providers: [BorrowerRecordService],
    exports: [BorrowerRecordService]
})
export class BorrowerRecordModule {}