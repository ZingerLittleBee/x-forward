import { NestFactory } from '@nestjs/core'
import { ClientModule } from './client.module'

async function bootstrap() {
    const app = await NestFactory.create(ClientModule)
    await app.listen(5000)
}
bootstrap()
