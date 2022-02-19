import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { EnvKeyEnum } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { ExecutorModule } from '@x-forward/executor'
import { RegisterService } from './register.service'

@Module({
    imports: [
        HttpModule.registerAsync({
            useFactory: () => {
                return {
                    baseURL: getEnvSetting(EnvKeyEnum.ServerUrl),
                    headers: {
                        [EnvKeyEnum.CommunicationKey]: getEnvSetting(EnvKeyEnum.CommunicationKey)
                    },
                    timeout: 5000,
                    maxRedirects: 5
                }
            }
        }),
        ExecutorModule
    ],
    providers: [RegisterService]
})
export class RegisterModule {}
