import { Module } from "@nestjs/common";
import { GoogleDriveService } from "./googledrive.service";

@Module({
    providers: [GoogleDriveService],
    exports: [GoogleDriveService]
})
export class GoogleDriveModule {}