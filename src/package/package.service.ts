import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Package } from "./package.model";

@Injectable()
export class PackageService {
    constructor(@InjectModel("Package") private readonly packageModel: Model<Package>) {}

    async getPackages() {
        return await this.packageModel.find();
    }

    async getPackageById(packageId: string) {
        return await this.packageModel.findById(packageId);
    }

    async addPackage(pack: Package) {
        const newPack = new this.packageModel({
            name: pack.name,
            time: pack.time,
            price: pack.price,
            benefit: pack.benefit,
            booksPerLoan: pack.booksPerLoan
        });
        const result = await newPack.save();
        return result._id;
    }
    
}