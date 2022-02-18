import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { LogsService } from './logs.service'

@Module({
    imports: [ExecutorModule],
    providers: [LogsService]
})
export class LogsModule {}
