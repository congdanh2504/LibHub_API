import { IsNotEmpty } from "class-validator";
import * as mongoose from "mongoose"

export const BorrowerRecordSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    books: [{
        book: {type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true},
        quantity: {type: Number, required: true, min: 0}
    }],
    createdDate: {type: Date, default: Date.now()},
    returnDate: {type: Date, default: Date.now() + 3600 * 1000 * 24 * 7} ,
    status: {type: String, required: true}
});

export class BorrowerRecord {
    user: string;
    @IsNotEmpty()
    books: [{book: string, quantity: number}];
    createdDate: Date;
    returnDate: Date;
    status: string
}

export class BorrowRecordDto {
    id: string;
    book: string;
    quantity: number;
}