import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { google } from "googleapis";
import { GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI, GOOGLE_DRIVE_REFRESH_TOKEN } from "src/constants";

@Injectable()
export class GoogleDriveService {
    private driveClient;

    constructor() {
        this.driveClient = this.createDriveClient();
    }
    
    createDriveClient() {
        const client = new google.auth.OAuth2(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI);
    
        client.setCredentials({ refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN });
    
        return google.drive({
          version: 'v3',
          auth: client,
        });
    }

    async getPicture(file: Express.Multer.File) {
        const res =  await this.driveClient.files.create({
          requestBody: {
            name: file.filename,
            mimeType: "image/jpeg",
            parents: ["1ix9DSm9xqpF0UF86F-GmuNpXGj8lNOYe"],
          },
          media: {
            mimeType: "image/jpeg",
            body: fs.createReadStream(file.path),
          },
          fields: 'id'
        });
        return `https://drive.google.com/uc?export=view&id=${res.data.id}`;
    }
}