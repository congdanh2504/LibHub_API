import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PackageController } from "./package.controller";
import { PackageSchema } from "./package.model";
import { PackageService } from "./package.service";

@Module({
    imports: [MongooseModule.forFeature([{name: "Package", schema: PackageSchema}])],
    controllers: [PackageController],
    providers: [PackageService],
    exports: [PackageService]
})
export class PackageModule {}