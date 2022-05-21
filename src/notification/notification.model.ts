import * as mongoose from 'mongoose'

export const NotificationSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    isSend: {type: Boolean, required: true, default: false},
    createdDate: {type: Date, required: true, default: Date.now()},
    message: {type: String, required: true}
});

export class Notification {
    _id: string;
    user: string;
    isSend: boolean;
    createdDate: Date;
    message: string;
}