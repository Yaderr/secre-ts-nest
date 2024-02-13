import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { SecretsModule } from './secrets/secrets.module';
import { SeedModule } from './seed/seed.module';
import { PasswordsModule } from './passwords/passwords.module';
import { CommonModule } from './common/common.module';
import { JoinValidationSchema } from './common/config/joi.validation';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: JoinValidationSchema 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOT'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER_NAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: configService.get('NODE_ENV') === 'production' ? false : true, //TODO: MODE=PRODUCTION=false
        autoLoadEntities: true
      })
    }),
    AuthModule,
    CryptoModule,
    SecretsModule,
    SeedModule,
    PasswordsModule,
    CommonModule,
    CardsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
