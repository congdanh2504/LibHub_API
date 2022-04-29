import { IsNotEmpty } from "class-validator";

export class ReviewDto {
    userId: string;
    @IsNotEmpty()
    bookId: string;
    @IsNotEmpty()
    rate: number;
    @IsNotEmpty()
    comment: string;
}