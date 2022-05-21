import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_ID, API_KEY } from "src/constants";
import { User } from "src/user/user.model";
import { UserService } from "src/user/user.service";
const OneSignal = require('onesignal-node');  

@Injectable()
export class NotificationService {
    client: any;
    
    constructor(@InjectModel("Notification") private readonly notificationModel: Model<Notification>) {
        this.client = new OneSignal.Client(APP_ID, API_KEY);
    }

    async addNotification(message: string, user: User) {
        const newNotification = new this.notificationModel({
            user: user.id,
            message: message
        });
        await newNotification.save();
        if (user.deviceIds.length > 0) {
            const push = {
                include_player_ids: user.deviceIds,
                headings: {
                  'en': 'Library Hub notification',
                },
                contents: {
                  'en': message,
                }
              };
            await this.client.createNotification(push);
        }
    }
}