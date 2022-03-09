import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { EnvKeyEnum } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { ClientModule } from './client.module'

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(ClientModule, {
        transport: Transport.GRPC,
        options: {
            package: 'executor',
            protoPath: `${process.cwd()}/protos/executor.proto`,
            url: `0.0.0.0:${getEnvSetting(EnvKeyEnum.ClientPort)}`
        }
    })
    app.listen()
    Logger.log(`Client is running on: ${getEnvSetting(EnvKeyEnum.ClientPort)}`)
}
bootstrap()
