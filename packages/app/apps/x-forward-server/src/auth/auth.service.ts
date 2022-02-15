import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getEnumKeyByValue, isDef, RoleEnum } from '@x-forward/shared'
import { UserService } from '../modules/user/user.service'

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username)
        if (user && user.password === pass) {
            const { password, ...result } = user
            if (isDef(result?.role)) {
                return { ...result, role: getEnumKeyByValue(result.role, RoleEnum)?.toLocaleLowerCase() }
            }
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
