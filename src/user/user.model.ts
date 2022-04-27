import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    borrowingNum: {type: Number, required: true}
});

UserSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})

export class User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    borrowingNum: number;
}