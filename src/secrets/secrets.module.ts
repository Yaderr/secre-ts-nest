import { Module } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { SecretsController } from './secrets.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  controllers: [SecretsController],
  providers: [SecretsService],
  imports: [AuthModule, CryptoModule],
  exports: []
})
export class SecretsModule {}
