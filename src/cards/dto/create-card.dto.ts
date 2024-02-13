import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { cardType } from "../interface";

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @MinLength(16)
    @MaxLength(19)
    @IsNotEmpty()
    number: number

    @IsDateString()
    @IsNotEmpty()
    expire: Date

    @MinLength(3)
    @MaxLength(4)
    @IsNotEmpty()
    sec_code: number

    @IsString()
    @IsNotEmpty()
    @IsEnum(cardType)
    type: cardType

}
