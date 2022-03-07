import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { GrpcHelperModule } from '../grpc-helper/grpc-helper.module'
import { RegisterController } from './register.controller'
import { RegisterService } from './register.service'

@Module({
    imports: [GrpcHelperModule, ExecutorModule],
    providers: [RegisterService],
    controllers: [RegisterController],
    exports: [RegisterService]
})
export class RegisterModule {}
