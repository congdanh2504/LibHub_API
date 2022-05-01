import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "./category.model";
import { Model } from "mongoose";

@Injectable()
export class CategoryService {
    constructor(@InjectModel("Category") private readonly categoryModel: Model<Category>) {}

    async addCategory(category: Category) {
        const newCategory = new this.categoryModel({
            name: category.name,
            books: [],
            picture: category.picture
        });
        const result = await newCategory.save();
        return result.id;
    }

    async addBookToCategory(categoryId: string, bookId: string) {
        const category = await this.categoryModel.findById(categoryId);
        category.books.push(bookId);
        await category.save();
    }
}