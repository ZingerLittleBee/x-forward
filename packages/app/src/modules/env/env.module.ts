import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExecutorModule } from '../executor/executor.module'
import { GatewayModule } from '../gateway/gateway.module'
import { PatchModule } from '../patch/patch.module'
import { EnvController } from './env.controller'
import { EnvService } from './env.service'

@Module({
    imports: [CacheModule.register(), ConfigModule.forRoot(), PatchModule, ExecutorModule, GatewayModule],
    controllers: [EnvController],
    providers: [EnvService],
    exports: [EnvService]
})
export class EnvModule {}
