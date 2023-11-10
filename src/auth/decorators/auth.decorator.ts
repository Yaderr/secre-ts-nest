import { UseGuards, applyDecorators } from "@nestjs/common"
import { AuthGuard } from "../guards/auth.guard"

export const Auth = () => {
    return applyDecorators(
        UseGuards(AuthGuard)
    )
}