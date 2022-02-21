import { NestFactory } from '@nestjs/core'
import { EnvKeyEnum } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { ClientModule } from './client.module'

async function bootstrap() {
    const app = await NestFactory.create(ClientModule, {
        logger: ['verbose', 'debug', 'log', 'warn', 'error']
    })
    await app.listen(getEnvSetting(EnvKeyEnum.ClientPort))
}
bootstrap()
