import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APP_ID, API_KEY } from "src/constants";
import { User } from "src/user/user.model";
import { UserService } from "src/user/user.service";
import { Notification } from "./notification.model";
import { Cron, CronExpression } from "@nestjs/schedule";
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

    @Cron('10 * * * * *')
    async checkPackageExpired() {
        const users = await this.userService.getUsers();
        for (let i=0; i<users.length; ++i) {
            if (users[i].currentPackage != null) {
                const currentDateTime = new Date(Date.now());
                const userDate = users[i].expiration;
                userDate.setHours(userDate.getHours() - 7)
                const seconds = Math.abs((userDate.getTime() - currentDateTime.getTime())/1000);
                if (seconds < 60) {
                    this.addNotification("Your package is expired", users[i]._id.toString());
                }
            }
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkBorrowerReturn() {
        const records = await this.userService.getRecords();
        for (let i=0; i<records.length; ++i) {
            const currentDateTime = new Date(Date.now());
            const recordDate = records[i].returnDate;
            recordDate.setHours(recordDate.getHours() - 7);
            const days = (recordDate.getTime() - currentDateTime.getTime())/(1000 * 3600 * 24);
            if (days == 1) {
                this.addNotification("Your borrower record will expire in 1 day, please return", records[i].user["_id"]);
            }
        }
    }
}