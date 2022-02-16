import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common'
import { Result } from '@x-forward/common'
import { inspect } from 'util'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'

@Controller()
export class AppController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        Logger.verbose(`login: ${inspect(req?.user)}`)
        return Result.okData(await this.authService.login(req?.user))
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return Result.okData(req.user)
    }
}
