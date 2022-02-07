import { NestFactory } from '@nestjs/core'
import { ClientModule } from './client.module'

async function bootstrap() {
    const app = await NestFactory.create(ClientModule, {
        logger: ['verbose', 'debug', 'log', 'warn', 'error']
    })
    await app.listen(3000)
}
bootstrap()
