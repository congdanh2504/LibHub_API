import { IsNotEmpty, Min } from 'class-validator';
import * as mongoose from 'mongoose'

export const BookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nameLower: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    authorLower: {type: String, required: true},
    publisher: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false},
    price: {type: Number, required: false},
    quantity: {type: Number, required: false, min: 0},
    location: { 
        face: Number,
        column: Number,
        row: Number
    },
    borrowedNum : {
        type: Number,
        default: 0,
    },
    picture: {type: String, required: true},
    avgRate: {type: Number, required: false},
    reviews: [{
        user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        rate: {type: Number, required: false},
        comment: {type: String, required: false}
    }],
    type: {type: String, required: true},
    publishYear: {type: Number, required: true},
    requester: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}
});

BookSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['authorLower']
        delete ret['nameLower']
        return ret
    }
})

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
    category: string;
    @IsNotEmpty()
    price: number;
    @IsNotEmpty()
    picture: string;
    @IsNotEmpty()
    @Min(1)
    quantity: number;
    @IsNotEmpty()
    location: {
        face: number,
        column: number,
        row: number
    };
    borrowedNum: number;
    avgRate: number;
    reviews: [{
        user : string,
        rate: number,
        comment: string
    }];
    type: string;
    @IsNotEmpty()
    publishYear: number;
}

export class RequestedBook {
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
    picture: string;
    @IsNotEmpty()
    type: string;
    @IsNotEmpty()
    publishYear: number;
    requester: string
}