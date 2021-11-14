import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GatewayModule } from '../gateway/gateway.module'
import { RenderModule } from '../render/render.module'
import { EnvController } from './env.controller'
import { EnvService } from './env.service'

@Module({
    imports: [CacheModule.register(), ConfigModule.forRoot(), RenderModule, GatewayModule],
    controllers: [EnvController],
    providers: [EnvService],
    exports: [EnvService]
})
export class EnvModule {}
