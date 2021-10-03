import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()

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
