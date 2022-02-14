import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../modules/user/user.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
