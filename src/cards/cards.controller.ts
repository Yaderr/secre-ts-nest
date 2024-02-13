import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { PaginatedResponseDto, PaginatedSeachQueryDto } from 'src/common/dto/paginated.dto';
import { Card } from './entities/card.entity';

@Controller('cards')
export class CardsController {
  
  constructor(private readonly cardsService: CardsService) {
    
  }

  @Post()
  @Auth()
  create(@Body() createCardDto: CreateCardDto, @GetUser() user: User) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.cardsService.findAll(user);
  }

  @Get('search')
  @Auth()
  findAllPaginated(@GetUser() user: User, @Query() query: PaginatedSeachQueryDto) {
    return this.cardsService.findAllSearch(user, query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @GetUser() user: User) {
    return this.cardsService.update(id, updateCardDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.cardsService.remove(id, user);
  }
}
