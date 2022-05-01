import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategorySchema } from "./category.model";
import { CategoryService } from "./category.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "Category", schema: CategorySchema}])],
    providers: [CategoryService],
    exports: [CategoryService]
})
export class CategoryModule {}