import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Book, RequestedBook } from "./book.model";
import { Model } from "mongoose";
import { ReviewDto } from "./review.dto";
import { User } from "src/user/user.model";

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
            picture: book.picture,
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
                picture: book.picture,
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

    async addReview(dto: ReviewDto, user: User) {
        const book = await this.bookModel.findById(dto.bookId);
        book.avgRate = ((book.avgRate*book.reviews.length) + dto.rate) / (book.reviews.length + 1);
        book.reviews.push({
            user: user,
            comment: dto.comment,
            rate: dto.rate
        });
        return await book.save();
    }

    async addRequestedBook(book: RequestedBook, user: User) {
        const newBook = new this.bookModel({
            name: book.name,
            description: book.description,
            author: book.author,
            publisher: book.publisher,
            picture: book.picture,
            type: book.type,
            publishYear: book.publishYear,
            requester: user
        });
        const result = await newBook.save();
        result.categories = undefined;
        result.reviews = undefined;
        await result.save();
        return result.id;
    }
}