import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "./category.model";
import { Model } from "mongoose";

@Injectable()
export class CategoryService {
    constructor(@InjectModel("Category") private readonly categoryModel: Model<Category>) {}

    async getAllCategories() {
        return await this.categoryModel.find();
    }

    async addCategory(category: Category) {
        const newCategory = new this.categoryModel({
            name: category.name,
            picture: category.picture
        });
        const result = await newCategory.save();
        return result.id;
    }
}