import { User } from "../entities/user.entity"

export interface LoginResponse {
    user: User
    access_token: string,
  }