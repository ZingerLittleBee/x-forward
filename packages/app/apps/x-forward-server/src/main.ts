import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvKeyEnum, getEnvSetting } from '@x-forward/common'
import * as helmet from 'helmet'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './filter/global-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['verbose', 'debug', 'log', 'warn', 'error']
    })
    app.enableCors()
    app.use(helmet())
    app.useGlobalFilters(new GlobalExceptionFilter())
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
            // transformOptions: {
            //     enableImplicitConversion: true
            // }
        })
    )

    const options = new DocumentBuilder()
        .setTitle('XForward API')
        .setDescription('The XForward API description')
        .setVersion('0.0.1')
        .addTag('API')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)

    const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'report',
            protoPath: `${process.cwd()}/protos/report.proto`,
            url: `0.0.0.0:${getEnvSetting(EnvKeyEnum.Server_Grpc_Port)}`
        }
    })
    await app.startAllMicroservices()
    await app.listen(getEnvSetting(EnvKeyEnum.ServerPort))

    Logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
