import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { GrpcHelperModule } from '../grpc-helper/grpc-helper.module'
import { RegisterService } from './register.service'

@Module({
    imports: [GrpcHelperModule, ExecutorModule],
    providers: [RegisterService],
    exports: [RegisterService]
})
export class RegisterModule {}
