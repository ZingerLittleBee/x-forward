import { NestFactory } from '@nestjs/core'
import { ClientModule } from './client.module'
import { DefaultEnum, EnvKeyEnum } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'

async function bootstrap() {
    const app = await NestFactory.create(ClientModule, {
        logger: ['verbose', 'debug', 'log', 'warn', 'error']
    })
    await app.listen(getEnvSetting(EnvKeyEnum.ClientPort))
}
bootstrap()
