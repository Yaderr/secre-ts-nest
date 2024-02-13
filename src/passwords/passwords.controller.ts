import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { PaginatedSeachQueryDto } from 'src/common/dto/paginated.dto';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  @Auth()
  create(@Body() createPasswordDto: CreatePasswordDto, @GetUser() user: User) {
    return this.passwordsService.create(createPasswordDto, user);
  }

  @Get()
  @Auth()
  findAll(@GetUser() user) {
    return this.passwordsService.findAll(user);
  }

  @Get('/search')
  @Auth()
  findAllPaginated(@GetUser() user, @Query() query: PaginatedSeachQueryDto) {
    return this.passwordsService.findAllSearch(user, query);
  }
  
  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.passwordsService.findOne(id, user);
  }


  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto, @GetUser() user: User) {
    return this.passwordsService.update(id, updatePasswordDto, user);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.passwordsService.remove(id, user);
  }
}
