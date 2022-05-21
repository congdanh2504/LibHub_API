import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookModule } from "src/book/book.module";
import { NotificationModule } from "src/notification/notification.module";
import { UserModule } from "src/user/user.module";
import { BorrowerRecordSchema } from "./borrowerrecord.model";
import { BorrowerRecordService } from "./borrowerrecord.service";


@Module({
    imports: [MongooseModule.forFeature([{name: "BorrowerRecord", schema: BorrowerRecordSchema}]), BookModule, NotificationModule, forwardRef(() => UserModule)],
    providers: [BorrowerRecordService],
    exports: [BorrowerRecordService]
})
export class BorrowerRecordModule {}