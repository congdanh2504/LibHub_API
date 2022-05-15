import { Controller, Get } from "@nestjs/common";
import { PackageService } from "./package.service";

@Controller("package")
export class PackageController {
    constructor (private readonly packageService: PackageService) {}

    @Get()
    getPackages() {
        return this.packageService.getPackages();
    }
}