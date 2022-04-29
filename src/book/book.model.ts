import { IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose'
import { User, UserSchema } from 'src/user/user.model';

export const BookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    publisher: {type: String, required: true},
    categories: {type: [String], required: false},
    price: {type: Number, required: false},
    quantity: {type: Number, required: false},
    location: { 
        face: Number,
        column: Number,
        row: Number
    },
    picture: {type: String, required: true},
    avgRate: {type: Number, required: false},
    reviews: [{
        user : {type: UserSchema, required: false},
        rate: {type: Number, required: false},
        comment: {type: String, required: false}
    }],
    type: {type: String, required: true},
    publishYear: {type: Number, required: true},
    requester: {type: UserSchema, required: false}
});

export class Book {
    id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    author: string;
    @IsNotEmpty()
    publisher: string;
    @IsNotEmpty()
    categories: [{type: string}];
    @IsNotEmpty()
    price: number;
    @IsNotEmpty()
    picture: string;
    @IsNotEmpty()
    quantity: number;
    @IsNotEmpty()
    location: {
        face: number,
        column: number,
        row: number
    };
    avgRate: number;
    reviews: [{
        user : User,
        rate: number,
        comment: string
    }];
    @IsNotEmpty()
    type: string;
    @IsNotEmpty()
    publishYear: number;
}

export class RequestedBook {
    id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    author: string;
    @IsNotEmpty()
    publisher: string;
    @IsNotEmpty()
    picture: string;
    @IsNotEmpty()
    type: string;
    @IsNotEmpty()
    publishYear: number;
    requester: User
}