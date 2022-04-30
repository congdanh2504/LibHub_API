import { IsNotEmpty } from "class-validator";
import * as mongoose from "mongoose"

export const BorrowerRecordSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true}],
    createdDate: {type: Date, default: Date.now()},
    returnDate: {type: Date, default: Date.now() + 7} ,
    status: {type: String, required: true}
});

export class BorrowerRecord {
    user: string;
    @IsNotEmpty()
    books: [string];
    createdDate: Date;
    returnDate: Date;
    status: string
}