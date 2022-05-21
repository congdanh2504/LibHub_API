import { IsNotEmpty, Min } from 'class-validator';
import * as mongoose from 'mongoose'

export const BookSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nameLower: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    authorLower: {type: String, required: true},
    publisher: {type: String, required: false},
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
    isAccepted: {type: Boolean, required: false},
    picture: {type: String, required: true},
    avgRate: {type: Number, required: false},
    reviews: [{
        user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        rate: {type: Number, required: false},
        comment: {type: String, required: false}
    }],
    type: {type: String, required: true},
    publishYear: {type: Number, required: false},
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
    isAccepted: Boolean;
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
    requester;
}

export class RequestedBook {
    _id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    category: string;
    @IsNotEmpty()
    author: string;
    @IsNotEmpty()
    picture: string;
    type: string;
    requester: string
}