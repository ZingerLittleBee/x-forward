import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { RegisterModule } from '../register/register.module'
import { LogsService } from './logs.service'

@Module({
    imports: [ExecutorModule, RegisterModule],
    providers: [LogsService]
})
export class LogsModule {}
