import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisPorvider } from './providers/redis.provider';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, redisPorvider],
  imports: [
    CryptoModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h'
        }
      }),
      inject: [ConfigService]
    })
  ],
  exports: [JwtModule, AuthService]
})
export class AuthModule {}
