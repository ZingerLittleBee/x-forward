import { Module } from '@nestjs/common'
import { LogsService } from './logs.service'
import { ExecutorModule } from '@x-forward/executor'

@Module({
    imports: [ExecutorModule],
    providers: [LogsService]
})
export class LogsModule {}
