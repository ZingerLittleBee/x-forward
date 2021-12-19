import { NestFactory } from '@nestjs/core'
import { ExecutorModule } from './executor.module'

async function bootstrap() {
    const app = await NestFactory.create(ExecutorModule)
    await app.listen(3000)
}
bootstrap()
