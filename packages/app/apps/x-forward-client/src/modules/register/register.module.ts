import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ClientEnvKeyEnum } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { RegisterService } from './register.service'

@Module({
    imports: [
        // HttpModule
        HttpModule.registerAsync({
            useFactory: () => {
                return {
                    baseURL: getEnvSetting(ClientEnvKeyEnum.ServerUrl),
                    timeout: 5000,
                    maxRedirects: 5
                }
            }
        })
    ],
    providers: [RegisterService]
})
export class RegisterModule {}
