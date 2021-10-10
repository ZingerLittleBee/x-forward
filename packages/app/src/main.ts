import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    app.use(helmet())

    const options = new DocumentBuilder()
        .setTitle('XForward API')
        .setDescription('The XForward API description')
        .setVersion('0.0.1')
        .addTag('API')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)

    await app.listen(3000)
}
bootstrap()
