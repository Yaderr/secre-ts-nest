import { Injectable } from '@nestjs/common';
import { CreateSecretDto } from './dto/create-secret.dto';
import { UpdateSecretDto } from './dto/update-secret.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SecretsService {

  constructor(
    private cryptoService: CryptoService
  ){}


  async create(value: string, { id, randomkey }:User) {
    const res = await this.cryptoService.cipher(value, id, randomkey)
    return res
  }

  findAll() {
    return `This action returns all secrets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} secret`;
  }

  update(id: number, updateSecretDto: UpdateSecretDto) {
    return `This action updates a #${id} secret`;
  }

  remove(id: number) {
    return `This action removes a #${id} secret`;
  }
}
