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
            booksPerLoan: pack.booksPerLoan,
            borrowDays: pack.borrowDays
        });
        const result = await newPack.save();
        return result._id;
    }
    
    async updatePackage(pack: Package, packageId: string) {
        const currentPack = await this.packageModel.findById(packageId);
        currentPack.name = pack.name;
        currentPack.time = pack.time;
        currentPack.benefit = pack.benefit;
        currentPack.price = pack.price;
        currentPack.booksPerLoan = pack.booksPerLoan;
        currentPack.borrowDays = pack.borrowDays;
        const result = await currentPack.save();
        return result._id;
    }

    async deletePackage(packageId: string) {
        return await this.packageModel.deleteOne({_id: packageId});
    }
}