import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "../entities/user.entity";

export const GetUser = createParamDecorator((data: string, context: ExecutionContext): User | boolean | Date => {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    return !data ? user: user[data]
}) 