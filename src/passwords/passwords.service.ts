import { Injectable, NotImplementedException, Logger, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from './entities/password.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { CryptoService } from 'src/crypto/crypto.service';
import { User } from 'src/auth/entities/user.entity';
import { error, log } from 'console';
import { WebsiteDetail } from './entities/websiteDetail.entity';
import { PaginatedResponseDto, PaginatedSeachQueryDto } from 'src/common/dto/paginated.dto';

@Injectable()
export class PasswordsService {

  private logger = new Logger('PasswordsService')

  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    @InjectRepository(WebsiteDetail)
    private readonly websiteDetailRepository: Repository<WebsiteDetail>,
    private readonly cryptoService: CryptoService,
    private readonly dataSource: DataSource
  ){}
  
  async create(createPasswordDto: CreatePasswordDto, user: User) { // TODO: way to insert the website url to db 
    const { id, randomkey } = user
    
    try {
      const websiteD = await this.websiteDetailRepository.findOneBy({ websiteUrl: createPasswordDto.websiteUrl}) ?? new WebsiteDetail(createPasswordDto.websiteUrl)

      createPasswordDto.password = await this.cryptoService.cipher(createPasswordDto.password, id, randomkey)
      
      const password: Password = this.passwordRepository.create({ ...createPasswordDto, user, websiteDetails: websiteD })
      await this.passwordRepository.save(password)
      return password
    } catch(error) {
      this.handleException(error)
    }
  }

  async findAll(user: User): Promise<Password[] | []> {
    const passwords = await this.passwordRepository.findAndCount({
      where: { user: { id: user.id } },
      take: 9,
      order: {
        createdAt: 'DESC'
      }
    })
    if(passwords[0].length === 0) return []
    const decryptedPasswords = await this.cryptoService.decryptBulk<Password>(passwords[0], user.id, user.randomkey, 'password')
    return decryptedPasswords
  }

  async findAllSearch(user: User, query: PaginatedSeachQueryDto) {
    const { q = '', orderBy= 'createdAt', page = 1, pageSize = 2, sort='DESC' } = query
    const passwords: [Password[], number] = await this.passwordRepository.findAndCount({
      where: { user: { id: user.id}, title: ILike(`%${q}%`) },
      take: pageSize,
      skip: (page-1) * (pageSize),
      order: {
        [orderBy]: sort
      }
    })
    const response: PaginatedResponseDto<Password> = {
      total: passwords[1],
      page,
      results: passwords[0]
    }
    return response
  }

  async findOne(id: string, user: User): Promise<Password> {
    const { id: userId, randomkey } = user
    const password: Password = await this.passwordRepository.findOneBy({ id, user: { id: user.id } })

    if(!password) throw new NotFoundException(`Password with id ${id} Not found`)
    const decryptedPassword = await this.cryptoService.decrypt(password.password, userId, randomkey)

    return {
      ...password,
      password: decryptedPassword
    }
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto, user: User): Promise<void> {
    const { id: userId, randomkey } = user
    await this.findOne(id, user)

    const websiteD = await this.websiteDetailRepository.findOneBy({ websiteUrl: updatePasswordDto.websiteUrl}) ?? new WebsiteDetail(updatePasswordDto.websiteUrl)

    let password = await this.passwordRepository.preload({ id, ...updatePasswordDto, websiteDetails: websiteD})
    
    if(!password) throw new NotFoundException(`Password with id ${id} Not found`)
    
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try {
      password.password = await this.cryptoService.cipher(updatePasswordDto.password, userId, randomkey)
      await queryRunner.manager.save(password)
      await queryRunner.commitTransaction()
      await queryRunner.release()
    } catch(error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleException(error)
    }
  }

  async remove(id: string, user: User): Promise<void> {
    const password = await  this.findOne(id, user)
    await this.passwordRepository.remove(password)
  }

  private handleException(error: any): never {
    this.logger.error(error, { error })
    throw new InternalServerErrorException('Unexpected, Check logs')
  }
}
