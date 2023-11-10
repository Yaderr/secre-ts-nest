import { IsNotEmpty, IsString } from "class-validator"

export class CreatePasswordDto {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    websiteUrl: string

    @IsString()
    @IsNotEmpty()
    userNameEmail: string
    
    @IsString()
    @IsNotEmpty()
    password: string
}
