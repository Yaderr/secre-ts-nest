import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces';
import { User } from '../entities/user.entity';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService
  ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = this.getTokenFromHeaders(request)

    if(!token)
      throw new UnauthorizedException()

    try {
      const payload: JwtPayload = await this.jwtService.verify(token)
      const { id: userId } = payload
      const isStored = await this.authService.IsPrivateKeyStored(userId)
      if(!isStored) throw new UnauthorizedException('Modified')
      const user: User = await this.authService.findUserById(userId)
      if(!user || !user.isActive) throw new UnauthorizedException('Invalid')
      request['user'] = user
    } catch(error) {
      throw new UnauthorizedException(error.message)
    }
    
    return true
  }

  private getTokenFromHeaders(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
