import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BorrowerRecord } from "./borrowerrecord.model";
import { Model } from "mongoose";

@Injectable()
export class BorrowerRecordService {
    constructor(@InjectModel("BorrowerRecord") private readonly borrowerRecordModel: Model<BorrowerRecord>) {}

    async addRecord(dto: BorrowerRecord, userId: string) {
        const newRecord = new this.borrowerRecordModel({
            user: userId,
            books: dto.books,
            status: "pending"
        });
        const result = await newRecord.save();
        return result.id;
    }

    async getUserRecord(userId: string) {
        return this.borrowerRecordModel.find({user: userId}).populate(["user", "books"]);
    }
}