import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ClientEnvKeyEnum } from '@x-forward/common'
import { RegisterService } from './register.service'

@Module({
    imports: [
        HttpModule.registerAsync({
            useFactory: () => {
                return {
                    baseURL: process.env[ClientEnvKeyEnum.ServerUrl],
                    timeout: 5000,
                    maxRedirects: 5
                }
            }
        })
    ],
    providers: [RegisterService]
})
export class RegisterModule {}
