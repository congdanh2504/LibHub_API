import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Book } from "./book.model";
import { Model } from "mongoose";

@Injectable()
export class BookService {
    constructor(@InjectModel("Book") private readonly bookModel: Model<Book>) {}

    async getAllBooks() {
        return await this.bookModel.find({ type: "available" });
    }

    async getBookById(id: string) {
        return await this.bookModel.findById(id);
    }

    async addBook(book: Book) {
        const newBook = new this.bookModel({
            name: book.name,
            description: book.description,
            author: book.author,
            publisher: book.publisher,
            categories: book.categories,
            price: book.price,
            quantity: book.quantity,
            location: {
                face: book.location.face,
                column: book.location.column,
                row: book.location.row
            },
            avgRate: book.avgRate,
            reviews: [],
            type: book.type,
            publishYear: book.publishYear
        });
        const result = await newBook.save();
        return result.id;
    }

    async updateBook(id: string, book: Book) {
        return await this.bookModel.findByIdAndUpdate(id, 
            {
                name: book.name,
                description: book.description,
                author: book.author,
                publisher: book.publisher,
                categories: book.categories,
                price: book.price,
                quantity: book.quantity,
                location: {
                    face: book.location.face,
                    column: book.location.column,
                    row: book.location.row
                },
                avgRate: book.avgRate,
                type: book.type,
                publishYear: book.publishYear
            });
    }

    async deleteBook(id: string) {
        return await this.bookModel.findById(id).remove();
    }
}