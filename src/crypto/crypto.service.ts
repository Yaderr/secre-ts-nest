import { Inject, Injectable } from '@nestjs/common';
import { randomBytes, scrypt, createCipheriv, createDecipheriv } from 'node:crypto'
import { promisify } from 'node:util';
import { RedisClient } from '../auth/providers/redis.provider';

@Injectable()
export class CryptoService {

    constructor(
        @Inject('REDIS_CLIENT')
        private redisClient: RedisClient
    ){}

    private readonly algorithm = 'aes-256-ctr'
    
    async cipher(value: string, userId: string, randomKey: string) {
        const privateKeyBuffer = Buffer.from(await this.getPrivateKey(userId), 'hex')
        const randomKeyBuffer = Buffer.from(randomKey, 'hex')
        return this.encrypt(value, privateKeyBuffer, randomKeyBuffer)
    }

    private async encrypt(valueToEncrypt: string, privateKey: Buffer, randomkey: Buffer): Promise<string> {
        const cipher = createCipheriv(this.algorithm, privateKey, randomkey)
        let encrypted = cipher.update(valueToEncrypt)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return encrypted.toString('hex')
    }

    async decrypt(value: string, userId: string, randomKey: string): Promise<string> {
        const privateKeyBuffer = Buffer.from(await this.getPrivateKey(userId), 'hex')
        const randomKeyBuffer = Buffer.from(randomKey, 'hex')
        const valueBuffer = Buffer.from(value, 'hex')
        
        const decipher = createDecipheriv(this.algorithm, privateKeyBuffer, randomKeyBuffer)
        let decrypted = decipher.update(valueBuffer)
        decrypted = Buffer.concat([decrypted, decipher.final()])

        return decrypted.toString()
    }

    async decryptBulk<k> (
        encryptedDataObject: k[],
        userId: string,
        randomKey: string,
        propertyName: string
    ): Promise<k[]>  {
        const decryptPromises: Promise<string>[] = encryptedDataObject.map((encrypt) => {
            return this.decrypt(encrypt[propertyName], userId, randomKey)
        })

        const decryptedValues: string[] = await Promise.all<string>(decryptPromises)

        const decryptedDataObject: k[] = encryptedDataObject.map((value, index) => {
            value[propertyName] = decryptedValues[index]
            return value
        })
        
        return decryptedDataObject
    }

    private async getPrivateKey(userId: string): Promise<string> {
        return this.redisClient.get(userId)
    }

    async generatePrivateKeyFromPassword(password?: string): Promise<string> {
        const derivedKey: Buffer = await this.scryptString256(password)
        return derivedKey.toString('hex')
    }

    generateRandomKey(): string {
        return randomBytes(16).toString('hex')
    }

    private async scryptString256(value: string): Promise<Buffer> {
        return (await promisify(scrypt)(value, 'salt', 32)) as Buffer
    }
}
