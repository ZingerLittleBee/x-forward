import { Module } from '@nestjs/common'
import { ExecutorModule } from '../executor/executor.module'
import { GatewayService } from './gateway.service'

@Module({
    imports: [ExecutorModule],
    providers: [GatewayService],
    exports: [GatewayService]
})
export class GatewayModule {}
