import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BorrowerRecordSchema } from "./borrowerrecord.model";
import { BorrowerRecordService } from "./borrowerrecord.service";


@Module({
    imports: [MongooseModule.forFeature([{name: "BorrowerRecord", schema: BorrowerRecordSchema}])],
    providers: [BorrowerRecordService],
    exports: [BorrowerRecordService]
})
export class BorrowerRecordModule {

}