import { Module } from '@nestjs/common'
import { ExecutorModule } from '../executor/executor.module'
import { RenderModule } from '../render/render.module'
import { GatewayService } from './gateway.service'

@Module({
    imports: [ExecutorModule, RenderModule],
    providers: [GatewayService],
    exports: [GatewayService]
})
export class GatewayModule {}
