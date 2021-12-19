import { Module } from '@nestjs/common'
import { GatewayModule } from '../gateway/gateway.module'
import { EnvController } from './env.controller'
import { EnvService } from './env.service'

@Module({
    imports: [GatewayModule],
    controllers: [EnvController],
    providers: [EnvService],
    exports: [EnvService]
})
export class EnvModule {}
