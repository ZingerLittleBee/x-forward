import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { GrpcHelperModule } from '../grpc-helper/grpc-helper.module'
import { RegisterModule } from '../register/register.module'
import { LogsService } from './logs.service'

@Module({
    imports: [GrpcHelperModule, ExecutorModule, RegisterModule],
    providers: [LogsService]
})
export class LogsModule {}
