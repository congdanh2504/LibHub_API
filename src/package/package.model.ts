import { IsNotEmpty, IsNumber } from "class-validator";
import * as mongoose from "mongoose"

export const PackageSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    time: {type: Number, required: true},
    benefit: {type: String, required: true},
    booksPerLoan: {type: Number, required: true},
    borrowDays: {type: Number, required: true}
});

export class Package {
    _id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsNumber()
    price: number;
    @IsNumber()
    @IsNotEmpty()
    time: number;
    @IsNotEmpty()
    benefit: string;
    @IsNotEmpty()
    booksPerLoan: number;
    @IsNumber()
    @IsNotEmpty()
    borrowDays: number;
}