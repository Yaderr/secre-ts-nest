import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { redisPorvider } from 'src/auth/providers/redis.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [CryptoService, redisPorvider],
  exports: [CryptoService],
  imports: [ConfigModule]
})
export class CryptoModule {}
