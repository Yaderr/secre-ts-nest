import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { CreateSecretDto } from './dto/create-secret.dto';
import { UpdateSecretDto } from './dto/update-secret.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Post()
  @Auth()
  create(@GetUser() user: User, ) {
    return this.secretsService.create('Hola123', user);
  }

  @Get()
  findAll() {
    return this.secretsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.secretsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSecretDto: UpdateSecretDto) {
    return this.secretsService.update(+id, updateSecretDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.secretsService.remove(+id);
  }
}
