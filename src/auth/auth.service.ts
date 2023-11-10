import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload, LoginResponse } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { RedisClient } from './providers/redis.provider';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class AuthService {

  private logger: Logger = new Logger('AuthService')
  private readonly UNAUTHORIZED_MESSAGE = 'Invalid credentials'

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClient
  ){}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const passwordHash = await bcrypt.hash(createUserDto.password, +process.env.BCRYPT_SALT_ROUNDS)
      const randomkey = this.cryptoService.generateRandomKey()
      
      const user = this.userRepository.create({
        ...createUserDto,
        password: passwordHash,
        randomkey
      })
      await this.userRepository.save(user)
      delete user.password
      delete user.randomkey
      return user
    }catch(error) {
      this.handleExceptions(error)
    }
  }

  async login({ email, password }: LoginUserDto): Promise<LoginResponse> {
    const user: User = await this.findUserPasswordByEmail(email)
    
    if(!user || !user.isActive)
      throw new UnauthorizedException(this.UNAUTHORIZED_MESSAGE)

    const match = await bcrypt.compare(password, user.password)
    
    if(!match)
      throw new UnauthorizedException(this.UNAUTHORIZED_MESSAGE)

    await this.setPrivateKey(password, user.id)
    delete user.password

    const jwtToken = this.getJwt({ id: user.id })
    
    return {
      user,
      access_token: jwtToken
    }
  }

  async logOut(userId): Promise<void> {
    await this.redisClient.del(userId)
  }

  async setPrivateKey(password: string, userId: string): Promise<void> {
    const privateKey: string = await this.cryptoService.generatePrivateKeyFromPassword(password)
    await this.redisClient.set(userId, privateKey, 'EX', 3600)
  }

  async IsPrivateKeyStored(userId: string): Promise<boolean> {
    const privateKey = await this.redisClient.get(userId)
    return privateKey ? true : false
  } 

  private getJwt(payload: JwtPayload): string {
    return this.jwtService.sign(payload)
  }

  private findUserPasswordByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: { password: true, fullName: true, email: true, id: true, isActive: true }
    })
  }

  findUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id })
  }

  handleExceptions(error: any): never {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    
    this.logger.error({error})
    throw new InternalServerErrorException(`Unexpected error, please check server logs`)
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
