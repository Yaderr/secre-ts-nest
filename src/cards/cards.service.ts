import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginatedSeachQueryDto, PaginatedResponseDto } from 'src/common/dto/paginated.dto';

@Injectable()
export class CardsService {
  
  private logger: Logger = new Logger('CardsService')

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    
    try {
      const card: Card = this.cardRepository.create({ ...createCardDto, user})
      await this.cardRepository.save(card)
      return card 
    } catch(error) {
      this.handleExceptions(error)
    }
  }

  async findAll(user: User) {
    const cards = await this.cardRepository.findAndCount({
      where: { user: { id: user.id } },
      take: 9,
      order: {
        createdAt: 'DESC'
      }
    })
    return cards[0]
  }

  async findAllSearch(user: User, query: PaginatedSeachQueryDto) {
    const { q = '', orderBy= 'createdAt', page = 1, pageSize = 2, sort='DESC' } = query
    const cards: [Card[], number] = await this.cardRepository.findAndCount({
      where: { user: { id: user.id}, title: ILike(`%${q}%`) },
      take: pageSize,
      skip: (page-1) * (pageSize),
      order: {
        [orderBy]: sort
      }
    })
    const response: PaginatedResponseDto<Card> = {
      total: cards[1],
      page,
      results: cards[0]
    }
    return response
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  async update(id: string, updateCardDto: UpdateCardDto, user: User) {
    const card = await this.cardRepository.preload({ id, ...updateCardDto})
    await this.cardRepository.save(card)
  }

  async remove(id: string, user: User) {
    const card = await  this.cardRepository.findOneBy({id, user: { id: user.id }}) // User the class method to get one card with the user id validation
    await this.cardRepository.remove(card)
  }

  handleExceptions(error: any): never {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    
    this.logger.error({error})
    throw new InternalServerErrorException(`Unexpected error, please check server logs`)
  }
}