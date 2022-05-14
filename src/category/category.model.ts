import { IsNotEmpty } from "class-validator";
import * as mongoose from "mongoose"

export const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    picture: {type: String, required: true}
});

export class Category {
    @IsNotEmpty()
    name: String;
    @IsNotEmpty()
    picture: String;
}