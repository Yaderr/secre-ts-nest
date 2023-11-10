import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto {    
    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string
    
    @IsString()
    @IsNotEmpty()
    password: string
}