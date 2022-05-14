import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategorySchema } from "./category.model";
import { CategoryService } from "./category.service";
import { CategoryController } from "./categoty.controller";

@Module({
    imports: [MongooseModule.forFeature([{name: "Category", schema: CategorySchema}])],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})
export class CategoryModule {}