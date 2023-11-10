import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { SecretsModule } from './secrets/secrets.module';
import { SeedModule } from './seed/seed.module';
import { PasswordsModule } from './passwords/passwords.module';

/**
 * TODO: Add confiGModule
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOT,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, //TODO: MODE=PRODUCTION=false
      autoLoadEntities: true
    }),
    AuthModule,
    CryptoModule,
    SecretsModule,
    SeedModule,
    PasswordsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
