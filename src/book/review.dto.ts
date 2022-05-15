import { IsNotEmpty } from "class-validator";

export class ReviewDto {
    @IsNotEmpty()
    rate: number;
    @IsNotEmpty()
    comment: string;
}