import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Book, RequestedBook } from "./book.model";
import { Model } from "mongoose";
import { ReviewDto } from "./review.dto";
import { User } from "src/user/user.model";
import { CategoryService } from "src/category/category.service";

@Injectable()
export class BookService {
    constructor(@InjectModel("Book") private readonly bookModel: Model<Book>,
    private readonly categoryService: CategoryService) {}

    async getAllBooks() {
        return await this.bookModel.find({ type: "available" }).populate({
            path: "reviews.user",
            populate: {
                path: "currentPackage"
            }
        }).populate("category");
    }

    async getBooksByCategory(categoryId: string) {
        return await this.bookModel.find({ type: "available", category: categoryId}).populate({
            path: "reviews.user",
            populate: {
                path: "currentPackage"
            }
        }).populate("category");
    }

    async getBookById(id: string) {
        return await this.bookModel.findById(id).populate({
            path: "reviews.user",
            populate: {
                path: "currentPackage"
            }
        }).populate("category");
    }

    async addBook(book: Book) {
        const newBook = new this.bookModel({
            name: book.name,
            description: book.description,
            author: book.author,
            publisher: book.publisher,
            category: book.category,
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
            type: "available",
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
                category: book.category,
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

    async addReview(dto: ReviewDto, userId: string, bookId: string) {
        const book = await this.bookModel.findById(bookId);
        book.avgRate = ((book.avgRate*book.reviews.length) + dto.rate) / (book.reviews.length + 1);
        book.reviews.push({
            user: userId,
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
        result.category = undefined;
        result.reviews = undefined;
        await result.save();
        return result.id;
    }

    async checkQuantity(bookId: string, num: number) {
        const book = await this.bookModel.findById(bookId);
        if (book.quantity < num) return false;
        return true;
    }

    async editQuantity(bookId: string, num: number) {
        const book = await this.bookModel.findById(bookId);
        book.quantity = book.quantity - num;
        await book.save();
    }

    async increaseBorrowedNum(bookId: string) {
        const book = await this.bookModel.findById(bookId);
        book.borrowedNum = book.borrowedNum + 1;
        await book.save();
    }

    async getDiscover() {
        const discover = [];
        const topTenAvgRate = await this.bookModel.find({
            type: "available"
        }).sort({avgRate: -1}).limit(10).populate({
            path: "reviews.user",
            populate: {
                path: "currentPackage"
            }
        }).populate("category");
        discover.push(topTenAvgRate);

        const topTenBorrowedNum = await this.bookModel.find({
            type: "available"
        }).sort({borrowedNum: -1}).limit(10).populate({
            path: "reviews.user",
            populate: {
                path: "currentPackage"
            }
        }).populate("category");
        discover.push(topTenBorrowedNum);

        const topTenReviews = await this.bookModel.find({
            type: "available"
        }).sort({reviews: -1}).limit(10).populate({
            path: "reviews.user",
            populate: {
                path: "currentPackage"
            }
        }).populate("category");
        discover.push(topTenReviews);

        return discover
    }

    async search(query: String) {
        const words = query.split(" ");
        const set = new Set([]);
        
        for (let i=0; i<words.length; ++i) {
            const temp = await this.bookModel.find({type: "available"})
            .find({ $or:[ {nameLower: { $regex: '.*' + words[i] + '.*' } }, 
            {authorLower: { $regex: '.*' + words[i] + '.*'}}]});
            for (let j=0; j<temp.length; ++j) {
                set.add(temp[j].id);
            }
        }
        const res = [];
        for (var id of set) {
            const book = await this.bookModel.findById(id).populate({
                path: "reviews.user",
                populate: {
                    path: "currentPackage"
                }
            }).populate("category");
            res.push(book)
        }
        return res;
    }
}