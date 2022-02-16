import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { inspect } from 'util'
import { UserService } from '../modules/user/user.service'
import { UserVo } from '../modules/user/user.vo'

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<UserVo | null> {
        const user = await this.userService.findOne(username)
        if (user && user.password === pass) {
            const { password, ...result } = user
            // if (isDef(result?.role)) {
            //     return { ...result, role: getEnumKeyByValue(result.role, RoleEnum)?.toLocaleLowerCase() }
            // }
            return result
        }
        return null
    }

    async login(user: UserVo) {
        Logger.verbose(`auth user: ${inspect(user)}`)
        return {
            accessToken: this.jwtService.sign(user)
        }
    }
}
