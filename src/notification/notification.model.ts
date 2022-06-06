import * as mongoose from 'mongoose'

export const NotificationSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    createdDate: {type: Date, required: true, default: Date.now()},
    message: {type: String, required: true},
    isSeen: {type: Boolean, default: false}
});

export class Notification {
    _id: string;
    user: string;
    createdDate: Date;
    message: string;
    isSeen: Boolean
}