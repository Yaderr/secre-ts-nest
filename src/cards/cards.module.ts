import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PaginatedSeachQueryDto } from 'src/common/dto/paginated.dto';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [
    TypeOrmModule.forFeature([Card]),
    AuthModule,
    PaginatedSeachQueryDto
  ]
})
export class CardsModule {}
