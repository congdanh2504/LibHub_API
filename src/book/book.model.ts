import { IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose'

export const BookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    publisher: {type: String, required: true},
    categories: [{type: String}],
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    location: {
        face: {type: Number, required: true},
        column: {type: Number, required: true},
        row: {type: Number, required: true}
    },
    avgRate: {type: Number, required: true},
    reviews: [{
        user : {
            id: {type: String, required: true},
            username: {type: String, required: true},
            picture: {type: String, required: true}
        },
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
    quantity: number;
    @IsNotEmpty()
    location: {
        face: number,
        column: number,
        row: number
    };
    @IsNotEmpty()
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