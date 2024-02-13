import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, isString } from "class-validator";

export class PaginatedSeachQueryDto {
    @IsString()
    @IsOptional()
    q?: string

    @IsEnum({
        'title': 'title',
        'type': 'type',
        'expire': 'expire',
        'createdAt': 'createdAt',
        'updatedAt': 'updatedAt'
    })
    @IsString()
    @IsOptional()
    orderBy?: string
    
    @Transform(({ value }) => +value)
    @IsNumber()
    @IsOptional()
    page?: number

    @Transform(({ value }) => +value)
    @IsNumber()
    @IsOptional()
    pageSize?: number

    @IsEnum({
        'ASC': 'ASC',
        'DESC': 'DESC'
    })
    @IsString()
    @IsOptional()
    sort?: string
}

export class PaginatedResponseDto<TData> {
    total: number
    page: number
    results: TData[]
}