import { IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose'
import { UserSchema } from 'src/user/user.model';

export const BookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    publisher: {type: String, required: true},
    categories: [{type: String}],
    price: {type: Number, required: true},
    quantity: {type: Number, required: false},
    location: { 
        face: Number,
        column: Number,
        row: Number
    },
    picture: {type: String, required: true},
    avgRate: {type: Number, required: false},
    reviews: [{
        user : {type: UserSchema, required: true},
        rate: {type: Number, required: true},
        comment: {type: String, required: true}
    }],
    type: {type: String, required: true},
    publishYear: {type: Number, required: true}
});

export class Book {
    _id: string;
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
    quantity: number;
    location: {
        face: number,
        column: number,
        row: number
    };
    avgRate: number;
    reviews: [{
        user : {
            id: string,
            username: string,
            picture: string
        },
        rate: number,
        comment: string
    }];
    @IsNotEmpty()
    type: string;
    @IsNotEmpty()
    publishYear: number;
}