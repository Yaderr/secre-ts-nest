import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './entities/password.entity';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PasswordsController],
  providers: [PasswordsService],
  imports: [
    CryptoModule,
    AuthModule,
    TypeOrmModule.forFeature([Password])
  ],
  exports: []
})
export class PasswordsModule {}
