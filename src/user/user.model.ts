import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false},
    role: {type: String, required: true},
    currentPackage: {type: mongoose.Schema.Types.ObjectId, ref: "Package"},
    expiration: {type: Date},
    isBorrowing: {type: Boolean, default: false},
    deviceIds: [{type: String}],
    picture: {type: String, required: true}
});

UserSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    deviceIds: [string];
    currentPackage: string;
    expiration: Date;
    isBorrowing: Boolean;
    picture: string
}