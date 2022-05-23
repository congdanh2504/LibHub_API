import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_ID, API_KEY } from "src/constants";
import { User } from "src/user/user.model";
import { UserService } from "src/user/user.service";
import { Notification } from "./notification.model";
const OneSignal = require('onesignal-node');  

@Injectable()
export class NotificationService {
    private client: any;
    
    constructor(@InjectModel("Notification") private readonly notificationModel: Model<Notification>, 
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {
        this.client = new OneSignal.Client(APP_ID, API_KEY);
    }

    async addNotification(message: string, userId: string) {
        const user = await this.userService.getProfile(userId);
        const newNotification = new this.notificationModel({
            user: user.id,
            message: message
        });
        await newNotification.save();
        if (user.deviceIds.length > 0) {
            const push = {
                include_player_ids: user.deviceIds,
                headings: {
                  'en': 'Library Hub',
                },
                contents: {
                  'en': message,
                }
              };
            await this.client.createNotification(push);
        }
    }

    async getNotifications(userId: string) {
        return await this.notificationModel.find({ user: userId}).populate({
            path: "user",
            populate: {
                path: "currentPackage"
            }
        }).sort({createdDate: "desc"});
    }

    async deleteNotification(userId: string, notificationId: string) {
        await this.notificationModel.deleteOne({
            user: userId,
            _id: notificationId
        });
    }
}