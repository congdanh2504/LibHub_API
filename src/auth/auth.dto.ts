import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class AuthDto {

    @IsNotEmpty()
    @MinLength(5)
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string
}