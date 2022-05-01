import { IsNotEmpty } from "class-validator";
import * as mongoose from "mongoose"

export const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true}],
    picture: {type: String, required: true}
});

export class Category {
    @IsNotEmpty()
    name: String;
    books: [String];
    @IsNotEmpty()
    picture: String;
}