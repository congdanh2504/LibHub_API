import { IsNotEmpty } from "class-validator";

export class ReviewDto {
    @IsNotEmpty()
    bookId: string;
    @IsNotEmpty()
    rate: number;
    @IsNotEmpty()
    comment: string;
}