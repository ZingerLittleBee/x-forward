import { Module } from '@nestjs/common'
import { GatewayModule } from 'src/modules/gateway/gateway.module'
import { UpstreamModule } from 'src/modules/upstream/upstream.module'
import { ConfigChangeListener } from './config-change.listener'

@Module({
    imports: [UpstreamModule, GatewayModule],
    providers: [ConfigChangeListener]
})
export class ConfigChangeModule {}
